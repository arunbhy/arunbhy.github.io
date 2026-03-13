import React from "react";
import "./ButtonLight.css";

const ButtonLight = ({ text, link }) => {
    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="button-light">
                {text}
            </a>
        );
    }
    return (
        <button type="button" className="button-light">
            {text}
        </button>
    );
};

export default ButtonLight;
