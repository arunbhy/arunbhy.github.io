const projectList = [
    {
        title: `ThirdEye`,
        subtitle: `Spatial-Temporal Geolocation Workstation`,
        time: `Apr 2026 - Present`,
        summary: `Built a spatial-temporal RAG tool and AI workstation for verifying street-level imagery. The system leverages dense geometric matching and advanced computer vision to analyze geographic data and provide highly precise structural-surface verification.`,
        image: `images/thirdeye_logo.webp`,
        // link: `https://github.com/kautilyaa/ThirdEye`,
        tags: ['Python', 'Computer Vision', 'RAG', 'Spatial Analysis']
    },
    {
        title: `StellarSeek`,
        subtitle: `Vedic Astrology & Planetary Calculation Platform`,
        time: `March 2026 - May 2026`,
        summary: `Created a full-stack platform utilizing the Swiss Ephemeris for precise planetary calculations. The application features a Retrieval-Augmented Generation (RAG) chat interface and interactive visualizations to deliver personalized astrological insights.`,
        image: `images/stellarseek_logo.webp`,
        link: `https://stellarseek.arunbhy.com/`,
        tags: ['Python', 'FastAPI', 'React', 'D3.js', 'RAG']
    },
    {
        title: `TERminus`,
        subtitle: `Modular AI Agent Framework`,
        time: `September 2025 - April 2026`,
        summary: `Extended experimental design into modular local AI agent framework aimed at structured reasoning and controlled execution. System emphasized flexibility, allowing tools and data sources to be composed dynamically while maintaining clear boundaries between reasoning and action. Project explored how agent-based architectures could support experimentation, automation, and reproducibility in local development setting.`,
        image: `images/terminus_logo.webp`,
        link: `https://github.com/kautilyaa/TERMINUS`,
        tags: ['Python', 'LLMs', 'Agent Framework', 'RAG']
    },
    {
        title: `SmritiMeds`,
        subtitle: `Medication Management & Verification Application`,
        time: `April 2026`,
        summary: `Developed a medication management application focused on patient safety. The system utilizes advanced computer vision techniques based on recent research papers for accurate prescription label extraction and pill verification.`,
        image: `images/smritimeds_logo.webp`,
        link: `https://github.com/kautilyaa/SmritiMeds`,
        tags: ['Python', 'Computer Vision', 'Healthcare', 'AI Verification']
    },
    
    {
        title: `SafeSim`,
        subtitle: `Medical Text Simplification System`,
        time: `November 2025`,
        summary: `Developed medical text simplification system designed to make complex clinical content more accessible without compromising factual accuracy. Work combined neural language models with deterministic verification steps to ensure critical medical entities and relationships were preserved. Emphasis was placed on validation and safety, resulting in system that prioritized trust and correctness over surface-level fluency.`,
        image: `images/safesim_logo.webp`,
        link: `https://github.com/kautilyaa/safesim`,
        tags: ['Python', 'NLP', 'Transformers', 'spaCy', 'BERT']
    },
    
    {
        title: `TravelGenie`,
        subtitle: `AI-Powered Travel Planning System`,
        time: `October 2025`,
        summary: `Built distributed AI travel planning system that coordinated multiple domain services, such as flights, hotels, events, weather, and finance, through reasoning-driven orchestration layer. Project focused on enabling multi-step decision-making across services, allowing complex travel plans to be generated dynamically rather than through static queries. Delivered both web interface and conversational workflow, designed to feel intuitive while handling real-time data and coordination at scale.`,
        image: `images/travel_genie.webp`,
        link: `https://github.com/kautilyaa/TravelGenie`,
        // liveLink: `https://travelgenie.streamlit.app`,
        tags: ['Python', 'React', 'LLMs', 'Multi-Agent', 'APIs']
    },
    {
        title: `Bitcoin Sentiment Pulse`,
        subtitle: `Cryptocurrency Forecasting`,
        time: `January 2025`,
        summary: `Designed forecasting framework that combined real-time market data with news-driven sentiment signals to study short-term cryptocurrency price movements. Project explored how external sentiment could be incorporated into traditional time-series models and evaluated performance through back testing rather than one-off predictions. Focus remained on understanding signal contribution and robustness in noisy, volatile domain.`,
        image: `images/bitcoin_logo.webp`,
        link: `https://github.com/kautilyaa/BitPulse`,
        tags: ['Python', 'NLP', 'Time Series', 'Sentiment Analysis', 'LSTM']
    },
    {
        title: `T.R.U.S.T.`,
        subtitle: `Targeted Risk Understanding & Scoring Technology`,
        time: `November 2024 - February 2025`,
        summary: `Built end-to-end credit risk modeling framework using large-scale lending data to better understand borrower behavior over time. Project involved extensive feature engineering across temporal and vintage dimensions, followed by systematic model comparison and tuning. Strong focus was placed on interpretability and regulatory readiness, ensuring predictions could be explained clearly and responsibly.`,
        image: `images/Home_Credit_logo.webp`,
        link: `https://github.com/kautilyaa/TRUST`,
        tags: ['Python', 'XGBoost', 'Feature Engineering', 'scikit-learn']
    },
    {
        title: `LiveScreen Translation`,
        subtitle: `Manga Translation Pipeline`,
        time: `January 2024 - March 2024`,
        summary: `Created automated manga translation pipeline that addressed full localization workflow, from speech bubble detection to text translation and visual restoration. System combined computer vision, OCR optimization, and sequence modeling to reduce manual translation effort while maintaining visual and linguistic quality. Project was driven by practical goal of shortening localization timelines for independent publishers.`,
        image: `images/managa_translation.webp`,
        link: `https://github.com/kautilyaa/LiveTranslatorScreen`,
        tags: ['Python', 'OpenCV', 'OCR', 'Computer Vision', 'NLP']
    },
    {
        title: `bug-free-lamp`,
        subtitle: `Field value validation`,
        time: `February 2021`,
        summary: `The code is on validation of field value based on field name.`,
        image: `images/rag.webp`,
        link: `https://github.com/kautilyaa/bug-free-lamp`,
        tags: ['Python', 'Validation', 'NLP']
    },
    {
        title: `Antimicrobial Stewardship Platform`,
        subtitle: `Associated with Vellore Institute of Technology`,
        time: `February 2020`,
        summary: `This digital platform addresses the growing antimicrobial resistance and slow drug development by analyzing data to guide antimicrobial stewardship and decision-making on drug usage.`,
        image: `images/amsp_logo.webp`,
        link: `https://github.com/kautilyaa/AMSP`,
        tags: ['Python', 'Data Analysis', 'Healthcare', 'Flask']
    },
    {
        title: `Wi-Fi probe based digital surveillance`,
        subtitle: `Associated with Vellore Institute of Technology`,
        time: `March 2019`,
        summary: `An IoT-based security system that differentiates between residents and potential intruders using Wi-Fi sniffing, sending real-time alerts to homeowners, and employing PyShark and JSON for efficient operation.`,
        image: `images/wifiprobe.webp`,
        link: `https://github.com/kautilyaa/WifiProbe`,
        tags: ['Python', 'IoT', 'PyShark', 'Networking']
    }
];

export default projectList;
