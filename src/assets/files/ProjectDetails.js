const projectList = [
    {
        title: `T.R.U.S.T.`,
        subtitle: `Targeted Risk Understanding & Scoring Technology`,
        time: `2023 - 2024`,
        summary: `Developed a credit risk scoring pipeline combining Home Credit and Lending Club datasets (30M rows). Created 600+ temporal and vintage features capturing payment behavior and denial history. Used Optuna to optimize a Logistic Regression + XGBoost ensemble, improving F1 and KS metrics. Logged experiments with MLflow, deployed the model via Docker and Airflow, and shared SHAP-based explanations through a Looker dashboard.`,
        image: `images/Home_Credit_logo.png`,
        link: `https://github.com/kautilyaa/TRUST`
    },
    {
        title: `LiveScreen Translation`,
        subtitle: `Streamlining Manga Localization with AI-Powered Bubble Segmentation & Translation`,
        time: `January 2024 - March 2024`,
        summary: `Built a manga localization pipeline including bubble segmentation (UNet + ResNet-34), Japanese OCR tuning (Tesseract), and translation (Transformer with SentencePiece). Inference speed improved 30% over MarianMT. Used Stable Diffusion for text in-painting with LaTeX overlay. Reduced per-chapter translation time by ~3 hours; adopted by indie publishers for production use.`,
        image: `images/managa_translation.png`,
        link: `https://github.com/kautilyaa/LiveTranslatorScreen`
    },
    {
        title: `Book-Rating Collaborative Filtering`,
        subtitle: `Personalized Reading: Predicting Book Ratings with Cosine-Similarity k-NN`,
        time: `November 2024 - April 2025`,
        summary: `Processed 1M ratings from the BX-Books dataset; cleaned and filtered to 200k users and 40k books. Implemented both User-User and Item-Item Collaborative Filtering with cosine similarity via Surprise. Tuned neighborhood size (k=10–100); Item-Item with k=60 yielded MAD of 0.74. Analyzed variance with confidence ribbons in Matplotlib. Recommendations were showcased in a Streamlit prototype, complete with book cover fetch via ISBN.`,
        image: `images/book_recomendation.png`,
        link: `https://github.com/kautilyaa/BookWorm`
    },
    {
        title: `Ticket-Creation Customer-Support Bot`,
        subtitle: `Inbox to Insight: Smart Email Agent Built for Hackathon Excellence`,
        time: `Smart India Hackathon 2019`,
        summary: `Engineered a Python-based IMAP/SMTP bot that parses incoming support emails using NLTK keyword classification. Automatically requests missing ticket fields via email replies. Stored tickets in SQLite with auto-prioritization and owner assignment logic. Deployed for a national sponsor, saving ~15 staff-hours/week. Earned First Prize among 300+ teams in Smart India Hackathon 2019.`,
        image: `images/ticket_customer.png`,
        link: `https://github.com/kautilyaa/ticket-creation-customer-support`
    }
];

export default projectList;

