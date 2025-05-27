import React, { useState } from "react";
import ButtonDark from "../ButtonDark/ButtonDark";
import "./Contact.css";

const Contact = () => {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        const email = "arunbh.y@gmail.com";

        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }).catch(_ => {
        });
    }

    return (
        <div id="contact" className="contact">
            <h1>CONTACT</h1>
            <div className="contact-content">
                <h2>Let's work together!</h2>
                <div onClick={copyEmail} className="contact-button-container">
                    <ButtonDark className="contact-button" text={"Contact me"} />
                    {copied && <span className="copied-animation">Copied!</span>}
                </div>
            </div>
        </div>
    );
}

export default Contact;