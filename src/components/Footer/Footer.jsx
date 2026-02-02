import React from "react";
import "./Footer.css";

const Footer = () => {

    const year = new Date().getFullYear();

    return (
        <div className="footer">
            <div className="back-to-top-container">
                <a rel="noreferrer" href="#home" className="back-to-top">
                    <i className="fa fa-angle-up fa-3x" aria-hidden="true"></i>
                </a>
                <div className="social-links">
                    <a rel="noreferrer" href="https://www.linkedin.com/in/arunbh-yashaswi" target="_blank" aria-label="LinkedIn">
                        <i className="fa fa-linkedin"></i>
                    </a>
                    <a rel="noreferrer" href="https://github.com/kautilyaa" target="_blank" aria-label="GitHub">
                        <i className="fa fa-github"></i>
                    </a>
                    <a rel="noreferrer" href="https://stackoverflow.com/users/13945615/arunbh-yashaswi" target="_blank" aria-label="Stack Overflow">
                        <i className="fa fa-stack-overflow"></i>
                    </a>
                    <a rel="noreferrer" href="https://www.kaggle.com/arunbhy" target="_blank" aria-label="Kaggle">
                        <i className="fa fa-bar-chart"></i>
                    </a>
                    <a rel="noreferrer" href="https://www.instagram.com/arunbhyashaswi/" target="_blank" aria-label="Instagram">
                        <i className="fa fa-instagram"></i>
                    </a>
                </div>
            </div>
            <hr />
            <p>
                &copy; {year} - Created and maintained by <a rel="noreferrer" href="/">Arunbh Yashaswi</a>
            </p>

        </div>
    );
}

export default Footer;
