import React from "react";
import "./Footer.css";

const Footer = () => {

    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="back-to-top-container">
                <a rel="noreferrer" href="#home" className="back-to-top">
                    <i className="fa-solid fa-angle-up fa-3x" aria-hidden="true"></i>
                </a>
                <div className="social-links">
                    <a rel="noreferrer" href="https://www.linkedin.com/in/arunbh-yashaswi" target="_blank" aria-label="LinkedIn">
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a rel="noreferrer" href="https://github.com/kautilyaa" target="_blank" aria-label="GitHub">
                        <i className="fa-brands fa-github"></i>
                    </a>
                    <a rel="noreferrer" href="https://stackoverflow.com/users/13945615/arunbh-yashaswi" target="_blank" aria-label="Stack Overflow">
                        <i className="fa-brands fa-stack-overflow"></i>
                    </a>
                    <a rel="noreferrer" href="https://www.kaggle.com/arunbhy" target="_blank" aria-label="Kaggle">
                        <i className="fa-brands fa-kaggle"></i>
                    </a>
                    <a rel="noreferrer" href="https://scholar.google.com/citations?user=VijCCcEAAAAJ&hl=en" target="_blank" aria-label="Google Scholar">
                        <i className="fa-brands fa-google-scholar"></i>
                    </a>
                    <a rel="noreferrer" href="https://www.instagram.com/arunbhyashaswi/" target="_blank" aria-label="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                    </a>
                </div>
            </div>
            <hr />
            <p>
                &copy; {year} - Created and maintained by <a rel="noreferrer" href="/">Arunbh Yashaswi</a>
            </p>

        </footer>
    );
}

export default Footer;
