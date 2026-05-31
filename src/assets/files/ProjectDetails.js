const projectList = [
    {
        title: `ThirdEye`,
        subtitle: `Spatial-Temporal Geolocation Workstation`,
        time: `Apr 2026 - Present`,
        summary: `I built ThirdEye to verify street-level imagery using dense geometric matching and spatial-temporal RAG. It lines a query image up against geographic data and gives structural-surface evidence for whether a location checks out.`,
        image: `images/thirdeye_logo.webp`,
        // link: `https://github.com/kautilyaa/ThirdEye`,
        tags: ['Python', 'Computer Vision', 'RAG', 'Spatial Analysis']
    },
    {
        title: `StellarSeek`,
        subtitle: `Vedic Astrology & Planetary Calculation Platform`,
        time: `March 2026 - May 2026`,
        summary: `I built StellarSeek as a full-stack Vedic astrology platform on top of the Swiss Ephemeris for accurate planetary calculations. It pairs a RAG chat interface with interactive D3 visualisations so the readings feel personal rather than generic.`,
        image: `images/stellarseek_logo.webp`,
        website: `https://stellarseek.arunbhy.com/`,
        tags: ['Python', 'FastAPI', 'React', 'D3.js', 'RAG']
    },
    {
        title: `TERminus`,
        subtitle: `Modular AI Agent Framework`,
        time: `September 2025 - April 2026`,
        summary: `I built TERMINUS, a modular framework for running local AI agents with structured reasoning and controlled execution. You compose tools and data sources on the fly while keeping a clear line between what the agent reasons about and what it is allowed to do.`,
        image: `images/terminus_logo.webp`,
        link: `https://github.com/kautilyaa/TERMINUS`,
        tags: ['Python', 'LLMs', 'Agent Framework', 'RAG']
    },
    {
        title: `SmritiMeds`,
        subtitle: `Medication Management & Verification Application`,
        time: `April 2026`,
        summary: `I built SmritiMeds to help patients manage medication safely. It reads prescription labels and verifies pills using computer-vision methods drawn from recent research papers.`,
        image: `images/smritimeds_logo.webp`,
        link: `https://github.com/kautilyaa/SmritiMeds`,
        tags: ['Python', 'Computer Vision', 'Healthcare', 'AI Verification']
    },
    
    {
        title: `SafeSim`,
        subtitle: `Medical Text Simplification System`,
        time: `November 2025`,
        summary: `I built SafeSim to simplify dense clinical text without dropping the facts that matter. It runs neural language models behind deterministic checks, so critical medical entities and relationships survive the rewrite. I cared more about trust and correctness here than about smooth-reading prose.`,
        image: `images/safesim_logo.webp`,
        link: `https://github.com/kautilyaa/safesim`,
        tags: ['Python', 'NLP', 'Transformers', 'spaCy', 'BERT']
    },
    
    {
        title: `TravelGenie`,
        subtitle: `AI-Powered Travel Planning System`,
        time: `October 2025`,
        summary: `I built TravelGenie to plan trips through reasoning rather than static search. It coordinates flights, hotels, events, weather and finance across separate services and assembles a plan step by step, through both a web interface and a chat-style workflow.`,
        image: `images/travel_genie.webp`,
        link: `https://github.com/kautilyaa/TravelGenie`,
        // liveLink: `https://travelgenie.streamlit.app`,
        tags: ['Python', 'React', 'LLMs', 'Multi-Agent', 'APIs']
    },
    {
        title: `Bitcoin Sentiment Pulse`,
        subtitle: `Cryptocurrency Forecasting`,
        time: `January 2025`,
        summary: `I built BitPulse to study short-term Bitcoin movements by folding news-driven sentiment into time-series models. Rather than chase one-off predictions, I back-tested the approach to see how much the sentiment signal actually adds in a noisy market.`,
        image: `images/bitcoin_logo.webp`,
        link: `https://github.com/kautilyaa/BitPulse`,
        tags: ['Python', 'NLP', 'Time Series', 'Sentiment Analysis', 'LSTM']
    },
    {
        title: `T.R.U.S.T.`,
        subtitle: `Targeted Risk Understanding & Scoring Technology`,
        time: `November 2024 - February 2025`,
        summary: `I built T.R.U.S.T., a credit-risk modelling framework on large-scale lending data. Most of the work was feature engineering across temporal and vintage dimensions, followed by careful model comparison, with interpretability and regulatory readiness kept front of mind.`,
        image: `images/Home_Credit_logo.webp`,
        link: `https://github.com/kautilyaa/TRUST`,
        tags: ['Python', 'XGBoost', 'Feature Engineering', 'scikit-learn']
    },
    {
        title: `LiveScreen Translation`,
        subtitle: `Manga Translation Pipeline`,
        time: `January 2024 - March 2024`,
        summary: `I built LiveScreen to automate manga localisation end to end, from spotting speech bubbles to translating the text and restoring the artwork. It stitches together computer vision, OCR and sequence modelling to cut the manual effort that slows independent publishers down.`,
        image: `images/managa_translation.webp`,
        link: `https://github.com/kautilyaa/LiveTranslatorScreen`,
        tags: ['Python', 'OpenCV', 'OCR', 'Computer Vision', 'NLP']
    },
    {
        title: `bug-free-lamp`,
        subtitle: `Field value validation`,
        time: `February 2021`,
        summary: `I wrote bug-free-lamp as a small utility that validates a field's value against what its name implies, an early experiment in rule-driven field checking.`,
        image: `images/rag.webp`,
        link: `https://github.com/kautilyaa/bug-free-lamp`,
        tags: ['Python', 'Validation', 'NLP']
    },
    {
        title: `Antimicrobial Stewardship Platform`,
        subtitle: `Associated with Vellore Institute of Technology`,
        time: `February 2020`,
        summary: `Built during my time at VIT, this platform tackles antimicrobial resistance by analysing usage data to guide stewardship decisions about which drugs to use and when.`,
        image: `images/amsp_logo.webp`,
        link: `https://github.com/kautilyaa/AMSP`,
        tags: ['Python', 'Data Analysis', 'Healthcare', 'Flask']
    },
    {
        title: `Wi-Fi probe based digital surveillance`,
        subtitle: `Associated with Vellore Institute of Technology`,
        time: `March 2019`,
        summary: `An early VIT project. An IoT security setup that tells residents apart from likely intruders by sniffing Wi-Fi probe requests and sending real-time alerts home, using PyShark and JSON to stay lightweight.`,
        image: `images/wifiprobe.webp`,
        link: `https://github.com/kautilyaa/WifiProbe`,
        tags: ['Python', 'IoT', 'PyShark', 'Networking']
    }
];

export default projectList;
