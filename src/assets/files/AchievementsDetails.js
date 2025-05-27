// import sihLogo from '../../public/images/sih_logo.png';
// import uhgLogo from '../../public/images/uhg_logo.jpeg';
// import ieeeLogo from '../../public/images/ieee_logo.png';
// import googleLogo from '../../public/images/google_logo.png';
// import microsoftLogo from '../../public/images/microsoft_logo.png';
// import awsLogo from '../../public/images/aws_logo.png';
// import kaggleLogo from '../../public/images/kaggle_logo.png';
// import githubLogo from '../../public/images/github_logo.png';

// // Map of all achievement-related images
// export const achievementImages = {
//     sih: sihLogo,
//     uhg: uhgLogo,
//     ieee: ieeeLogo,
//     google: googleLogo,
//     microsoft: microsoftLogo,
//     aws: awsLogo,
//     kaggle: kaggleLogo,
//     github: githubLogo
// };

const achievements = [
    {
        type: "Smart India Hackathon",
        year: "2019",
        summary: "Led a team of 6 to develop an AI-powered customer support ticket creation system. Implemented NLP-based email parsing and automated ticket routing, reducing manual processing time by 60%. Won First Prize among 300+ teams.",
        image: "images/SIH.png",
        organization: "Ministry of Human Resource Development, Government of India",
        link: "https://github.com/kautilyaa/ticket-creation-customer-support",
        linkText: "View Repository"
    },
    // {
    //     type: "Data Science Excellence Award",
    //     year: "2023",
    //     summary: "Recognized for outstanding contributions in developing machine learning models for automated document processing, achieving 96% accuracy and reducing processing time by 40%.",
    //     image: "public/images/unitedhealth_group_logo.jpeg",
    //     organization: "UnitedHealth Group",
    //     link: "https://www.unitedhealthgroup.com/",
    //     linkText: "View Award"
    // },
    {
        type: "Publication",
        year: "2021",
        summary: "Proposed a low-cost hybrid recommendation system combining collaborative filtering and content-based filtering using intelligent clustering. The system tailors content recommendations based on users' interaction history and real-time social data. The approach enables efficient, scalable filtering of social media posts based on dynamically inferred user interest groups.",
        image: "images/paper_recom.png",
        organization: "International Journal of Computer Applications",
        link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3884048",  // Add actual publication link if available
        linkText: "View Publication"
    },
    {
        type: "Patent Filed",
        year: "2024",
        summary: "A patented model that optimizes image matching in templated form processing workflows. Enhances document classification and retrieval efficiency by combining deep learning and image similarity measures.",
        image: "images/baadge_uhg.png",
        organization: "UnitedHealth Group",
        link: "https://www.credential.net/ba144ad4-9031-4dcf-89af-6398419f1e82#acc.LhbXOmz1",  // Add actual patent listing link if available
        linkText: "View Badge"
    }
];

export default achievements; 