Credit risk modeling is one of the few ML domains where feature engineering still dominates model architecture choices. A well-engineered feature set with XGBoost will outperform a neural network on raw features almost every time. Here's what I've learned building credit risk models in practice.

## The Challenge

Predicting whether a borrower will default sounds simple — it's a binary classification problem. But the nuances are everywhere:

- **Class imbalance** — default rates are typically 2-5%, sometimes lower
- **Regulatory requirements** — models must be explainable (goodbye, black boxes)
- **Temporal dynamics** — a borrower's risk changes over time
- **Feature interactions** — individual features rarely tell the story alone

## Feature Categories That Matter

### 1. Payment Behavior Features

Raw payment history is useful, but derived features are more predictive:

```python
def payment_features(payment_history):
    return {
        # Trend features
        "pct_on_time_last_6m": on_time_count(last_6m) / len(last_6m),
        "pct_on_time_last_12m": on_time_count(last_12m) / len(last_12m),
        "payment_trend": pct_on_time_last_6m - pct_on_time_last_12m,

        # Severity features
        "max_days_past_due": max(days_past_due),
        "avg_days_past_due": mean(days_past_due),
        "days_since_last_late": days_since(last_late_payment),

        # Pattern features
        "consecutive_on_time": current_on_time_streak,
        "late_payment_acceleration": late_count_last_3m / max(late_count_prev_3m, 1),
    }
```

The **payment_trend** feature is particularly powerful — it captures whether someone is getting better or worse at paying on time, which is more predictive than their overall rate.

### 2. Utilization Features

Credit utilization is the second most important factor after payment history:

```python
def utilization_features(accounts):
    utilizations = [a.balance / a.limit for a in accounts if a.limit > 0]
    return {
        "avg_utilization": np.mean(utilizations),
        "max_utilization": np.max(utilizations),
        "num_maxed_out": sum(1 for u in utilizations if u > 0.95),
        "utilization_variance": np.var(utilizations),
        "total_available_credit": sum(a.limit - a.balance for a in accounts),

        # Utilization change
        "utilization_delta_3m": current_util - util_3m_ago,
        "utilization_trend_slope": np.polyfit(range(12), monthly_utils, 1)[0],
    }
```

The **utilization_trend_slope** is a hidden gem — it captures whether someone is slowly maxing out their cards, often months before they actually miss a payment.

### 3. Inquiry and New Account Features

A burst of credit applications signals financial stress:

```python
def inquiry_features(inquiries, new_accounts):
    return {
        "inquiries_last_6m": count_recent(inquiries, months=6),
        "inquiries_last_12m": count_recent(inquiries, months=12),
        "inquiry_acceleration": inq_last_3m / max(inq_prev_3m, 1),
        "new_accounts_last_6m": count_recent(new_accounts, months=6),
        "avg_age_of_new_accounts": mean_age(new_accounts),
        "pct_new_accounts": len(recent_accounts) / max(len(all_accounts), 1),
    }
```

### 4. Interaction Features

This is where domain knowledge pays off. Some features only matter in combination:

```python
def interaction_features(base_features):
    return {
        # High utilization + declining payments = danger
        "stress_signal": (
            base_features["avg_utilization"] *
            max(-base_features["payment_trend"], 0)
        ),

        # Many inquiries + high utilization = seeking more credit while stretched
        "desperation_index": (
            base_features["inquiries_last_6m"] *
            base_features["avg_utilization"]
        ),

        # Low credit age + high utilization = thin file risk
        "thin_file_risk": (
            1 / max(base_features["avg_account_age_months"], 1) *
            base_features["avg_utilization"]
        ),
    }
```

## Model Stacking for Production

In practice, we found that stacking multiple models outperformed any single model:

```python
from sklearn.ensemble import StackingClassifier

stack = StackingClassifier(
    estimators=[
        ("xgb", XGBClassifier(scale_pos_weight=20)),
        ("lgbm", LGBMClassifier(is_unbalance=True)),
        ("lr", LogisticRegression(class_weight="balanced")),
    ],
    final_estimator=LogisticRegression(),  # Interpretable meta-learner
    cv=5,
    passthrough=True
)
```

Using **logistic regression as the meta-learner** is intentional — it keeps the final model interpretable while leveraging the pattern-finding ability of tree-based models.

## Handling Class Imbalance

Don't just oversample. Use a combination of techniques:

1. **SMOTE + Tomek links** — synthetic oversampling with boundary cleanup
2. **Scale_pos_weight** in XGBoost — adjusts the loss function
3. **Calibrated thresholds** — optimize the decision threshold for business metrics (expected loss), not accuracy

```python
from sklearn.metrics import precision_recall_curve

precisions, recalls, thresholds = precision_recall_curve(y_test, y_prob)

# Find threshold that minimizes expected loss
expected_losses = []
for t in thresholds:
    fn_cost = 10000  # Average loss from undetected default
    fp_cost = 50     # Cost of denying a good applicant
    preds = (y_prob >= t).astype(int)
    fn = ((preds == 0) & (y_test == 1)).sum()
    fp = ((preds == 1) & (y_test == 0)).sum()
    expected_losses.append(fn * fn_cost + fp * fp_cost)

optimal_threshold = thresholds[np.argmin(expected_losses)]
```

## Explainability Requirements

Regulators require that you can explain why someone was denied credit. SHAP values are the standard:

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# For a specific denial
def explain_denial(applicant_features, shap_values):
    top_factors = sorted(
        zip(feature_names, shap_values),
        key=lambda x: abs(x[1]),
        reverse=True
    )[:5]
    return [f"{name}: {val:.3f}" for name, val in top_factors]
```

This isn't optional — it's required by regulations like the Equal Credit Opportunity Act (ECOA) and the Fair Credit Reporting Act (FCRA).

## Key Takeaways

- Feature engineering > model complexity in credit risk
- Trend and velocity features (how things are changing) beat point-in-time snapshots
- Interaction features encode domain knowledge that models struggle to learn alone
- Always optimize for business metrics (expected loss), not statistical metrics (AUC)
- Explainability is a hard requirement, not a nice-to-have

---

*Further reading: [Credit Risk Scorecard Development](https://www.listendata.com/2019/08/credit-risk-modelling.html), [SHAP documentation](https://shap.readthedocs.io/)*