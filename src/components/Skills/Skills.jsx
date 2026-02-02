import React, { useState } from "react";
import "./Skills.css";
import { skills } from "../../assets/files/SkillsDetails.js";
import ButtonLight from "../ButtonLight/ButtonLight";

const Skills = () => {
    const [visibleSkills, setVisibleSkills] = useState(skills.map(() => false));

    const toggleSkillVisibility = (index) => {
        setVisibleSkills(visibleSkills.map((visible, i) => (i === index ? !visible : visible)));
    };

    return (
        <div id="skills" className="skills">
            <h1>TECHNICAL SKILLS</h1>
            <div className="skills-row">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className={`skill-card ${index % 2 === 0 ? 'slide-left even' : 'slide-right odd'} ${visibleSkills[index] ? 'expanded' : ''}`}
                        style={{ animationDelay: "500ms" }}
                    >
                        <h5>{skill.title}</h5>
                        {visibleSkills[index] && (
                            <ul>
                                {skill.content.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                        <div className="show-button" onClick={() => toggleSkillVisibility(index)}>
                            <ButtonLight text={visibleSkills[index] ? "Hide Skills" : "Show Skills"} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skills;
