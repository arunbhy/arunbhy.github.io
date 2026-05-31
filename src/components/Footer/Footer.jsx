import React from "react";
import "./Footer.css";

const socials = [
    { href: "https://www.linkedin.com/in/arunbh-yashaswi", label: "LinkedIn", icon: "fa-brands fa-linkedin" },
    { href: "https://github.com/kautilyaa", label: "GitHub", icon: "fa-brands fa-github" },
    { href: "https://stackoverflow.com/users/13945615/arunbh-yashaswi", label: "Stack Overflow", icon: "fa-brands fa-stack-overflow" },
    { href: "https://www.kaggle.com/arunbhy", label: "Kaggle", icon: "fa-brands fa-kaggle" },
    { href: "https://scholar.google.com/citations?user=VijCCcEAAAAJ&hl=en", label: "Google Scholar", icon: "fa-brands fa-google-scholar" },
    { href: "https://www.instagram.com/arunbhyashaswi/", label: "Instagram", icon: "fa-brands fa-instagram" },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="ed-footer">
            <div className="wrap">
                <p>© {year} · Arunbh Yashaswi · Built with React</p>

                <div className="social-links">
                    {socials.map((s) => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                            <i className={s.icon}></i>
                        </a>
                    ))}
                </div>

                <a
                    href="#/"
                    className="back-to-top"
                    onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                    Back to top ↑
                </a>
            </div>
        </footer>
    );
};

export default Footer;
