import React from "react";
import "./About.css";
import ButtonDark from "../ButtonDark/ButtonDark";

const About = () => {
    return (
        <section id="about" className="about">
            <div className="about-title">
                ABOUT ME
            </div>
            <div className="about-content">
                <div className="about-left">
                    <img src="images/pfp.JPG" alt="Profile picture not available" />
                </div>
                <div className="about-right">
                    <p>
                        I'm a second-year graduate student in Data Science at the University of Maryland, College Park, with a strong focus on computer vision and applied machine learning. I'm passionate about building intelligent systems that help people see patterns in complex data—especially where images, models, and human interaction intersect. My goal is to design AI tools that are not only technically sound but also intuitive and ethically grounded.
                    </p>

                    <p>
                        Beyond data and code, I enjoy reading books and comics alike, getting lost in story-rich RPGs, and exploring new running trails. Whether it's fine-tuning a neural network or shading a character panel, I thrive on problem-solving across both logic and creativity. Feel free to explore my work or reach out! I'm always open to connections and collaborations.
                    </p>
                    <a href="Resume_Arunbh.pdf" target="_blank" rel="noopener noreferrer">
                        <ButtonDark text="View Resume" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default About;
