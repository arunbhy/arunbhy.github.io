import React from "react";
import "./ButtonDark.css";

const ButtonDark = ({ text }) => {
    return (
        <button type="button" className="button-dark">{text}</button>
    );
};

export default ButtonDark;
