The most impactful work in any ML project usually happens before the model. Cleaning, transforming, and structuring data is unglamorous but decisive — a well-preprocessed dataset with a simple model will outperform a messy dataset with a state-of-the-art model almost every time.

## Designing Reproducible Pipelines

The cardinal sin of data preprocessing: doing it in a Jupyter notebook with unnamed cells and no version control. Every preprocessing step should be a named, testable function in a pipeline.

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

def build_preprocessing_pipeline(numeric_features, categorical_features):
    numeric_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])

    preprocessor = ColumnTransformer([
        ("numeric", numeric_pipeline, numeric_features),
        ("categorical", categorical_pipeline, categorical_features),
    ])

    return preprocessor
```

This approach gives you:
- **Reproducibility** — same pipeline, same results
- **No data leakage** — fit on training data, transform on test data
- **Serialization** — save and load with joblib

## Handling Missing Data

Missing data is rarely random. Understanding the pattern of missingness is as important as filling the gaps.

### Diagnosing Missingness

```python
def analyze_missing_data(df):
    missing = df.isnull().sum()
    missing_pct = (missing / len(df)) * 100
    missing_report = pd.DataFrame({
        "count": missing,
        "percentage": missing_pct,
        "dtype": df.dtypes
    })
    missing_report = missing_report[missing_report["count"] > 0]
    missing_report = missing_report.sort_values("percentage", ascending=False)

    # Check if missingness correlates with other features
    for col in missing_report.index:
        if missing_report.loc[col, "percentage"] > 5:
            indicator = df[col].isnull().astype(int)
            correlations = df.select_dtypes(include="number").corrwith(indicator)
            high_corr = correlations[correlations.abs() > 0.3]
            if not high_corr.empty:
                print(f"\n{col} missingness correlates with:")
                print(high_corr)

    return missing_report
```

### Imputation Strategies

| Strategy | When to Use |
|----------|-------------|
| Drop rows | <5% missing, MCAR (Missing Completely At Random) |
| Mean/median | Numeric, low missing rate, no strong patterns |
| Mode | Categorical, low missing rate |
| Forward/backward fill | Time series data |
| KNN imputation | Moderate missing rate, features are correlated |
| Indicator variable | Missingness itself is informative |

```python
from sklearn.impute import KNNImputer

# KNN imputation — uses similar rows to estimate missing values
knn_imputer = KNNImputer(n_neighbors=5, weights="distance")

# Always add a missingness indicator for important features
def impute_with_indicator(df, columns):
    for col in columns:
        df[f"{col}_was_missing"] = df[col].isnull().astype(int)
    df[columns] = knn_imputer.fit_transform(df[columns])
    return df
```

## Feature Encoding for Different Models

### High-Cardinality Categorical Features

One-hot encoding a column with 10,000 unique values creates a sparse, high-dimensional mess. Better approaches:

```python
# Target encoding — encode categories by their mean target value
from category_encoders import TargetEncoder

encoder = TargetEncoder(cols=["city", "product_id"], smoothing=10)
# smoothing prevents overfitting for rare categories

# Frequency encoding — encode by occurrence count
def frequency_encode(df, column):
    freq = df[column].value_counts(normalize=True)
    df[f"{column}_freq"] = df[column].map(freq)
    return df

# Hash encoding — fixed-dimension representation
from category_encoders import HashingEncoder

encoder = HashingEncoder(cols=["user_agent"], n_components=8)
```

### Date/Time Feature Engineering

Raw timestamps are useless to most models. Extract meaningful features:

```python
def extract_datetime_features(df, date_col):
    dt = pd.to_datetime(df[date_col])
    features = {
        f"{date_col}_hour": dt.dt.hour,
        f"{date_col}_day_of_week": dt.dt.dayofweek,
        f"{date_col}_month": dt.dt.month,
        f"{date_col}_is_weekend": dt.dt.dayofweek.isin([5, 6]).astype(int),
        f"{date_col}_quarter": dt.dt.quarter,

        # Cyclical encoding for periodic features
        f"{date_col}_hour_sin": np.sin(2 * np.pi * dt.dt.hour / 24),
        f"{date_col}_hour_cos": np.cos(2 * np.pi * dt.dt.hour / 24),
        f"{date_col}_month_sin": np.sin(2 * np.pi * dt.dt.month / 12),
        f"{date_col}_month_cos": np.cos(2 * np.pi * dt.dt.month / 12),
    }
    return pd.DataFrame(features)
```

Cyclical encoding is important — without it, the model thinks December (12) and January (1) are far apart, when they're actually adjacent.

## Text Preprocessing

For NLP pipelines, preprocessing quality directly impacts model performance:

```python
import re
import unicodedata

def clean_text(text, lowercase=True, remove_urls=True, remove_html=True):
    if not isinstance(text, str):
        return ""

    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)

    # Remove HTML tags
    if remove_html:
        text = re.sub(r'<[^>]+>', ' ', text)

    # Remove URLs
    if remove_urls:
        text = re.sub(r'https?://\S+|www\.\S+', '', text)

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()

    if lowercase:
        text = text.lower()

    return text

def preprocess_for_embeddings(texts, min_length=10):
    """Preprocessing for embedding models — less aggressive"""
    cleaned = []
    for text in texts:
        text = clean_text(text, lowercase=False)  # Keep case for embeddings
        if len(text) >= min_length:
            cleaned.append(text)
        else:
            cleaned.append(None)  # Flag for removal
    return cleaned
```

## Handling Outliers

Don't blindly remove outliers. Understand them first:

```python
def analyze_outliers(df, column, method="iqr"):
    if method == "iqr":
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        outliers = df[(df[column] < lower) | (df[column] > upper)]
    elif method == "zscore":
        z = np.abs((df[column] - df[column].mean()) / df[column].std())
        outliers = df[z > 3]

    print(f"Found {len(outliers)} outliers ({len(outliers)/len(df)*100:.1f}%)")
    print(f"Range: [{df[column].min():.2f}, {df[column].max():.2f}]")
    print(f"Outlier range: [{outliers[column].min():.2f}, {outliers[column].max():.2f}]")

    return outliers

# Options for handling:
# 1. Cap/floor (winsorize) — preserves the row, limits extreme values
def winsorize(series, limits=(0.01, 0.99)):
    lower = series.quantile(limits[0])
    upper = series.quantile(limits[1])
    return series.clip(lower, upper)

# 2. Log transform — compress the range
df["income_log"] = np.log1p(df["income"])

# 3. Robust scaling — uses median and IQR instead of mean and std
from sklearn.preprocessing import RobustScaler
scaler = RobustScaler()  # Naturally resistant to outliers
```

## Data Validation

Catch data quality issues before they reach your model:

```python
def validate_dataframe(df, schema):
    """Basic schema validation"""
    errors = []

    for col, rules in schema.items():
        if col not in df.columns:
            errors.append(f"Missing column: {col}")
            continue

        if "dtype" in rules:
            if not df[col].dtype == rules["dtype"]:
                errors.append(f"{col}: expected {rules['dtype']}, got {df[col].dtype}")

        if "min" in rules:
            violations = (df[col] < rules["min"]).sum()
            if violations > 0:
                errors.append(f"{col}: {violations} values below minimum {rules['min']}")

        if "max" in rules:
            violations = (df[col] > rules["max"]).sum()
            if violations > 0:
                errors.append(f"{col}: {violations} values above maximum {rules['max']}")

        if "allowed_values" in rules:
            invalid = ~df[col].isin(rules["allowed_values"])
            if invalid.sum() > 0:
                errors.append(f"{col}: {invalid.sum()} invalid values")

    return errors

# Usage
schema = {
    "age": {"dtype": "int64", "min": 0, "max": 150},
    "income": {"dtype": "float64", "min": 0},
    "status": {"allowed_values": ["active", "inactive", "pending"]},
}

errors = validate_dataframe(df, schema)
```

## Key Principles

1. **Pipeline everything.** No manual steps, no notebook-only transformations.
2. **Fit on train, transform on test.** Never let test data influence preprocessing parameters.
3. **Validate early and often.** Catch data issues at ingestion, not after training.
4. **Log transformations.** Track what you did so you can debug downstream issues.
5. **Keep raw data.** Never overwrite the original — always write to new columns or files.

The best preprocessing pipeline is one you can run on new data with a single function call and get the exact same transformations applied in the exact same order.

---

*Further reading: [Scikit-learn Pipelines](https://scikit-learn.org/stable/modules/compose.html), [Great Expectations](https://greatexpectations.io/), [Feature Engine](https://feature-engine.trainindata.com/)*