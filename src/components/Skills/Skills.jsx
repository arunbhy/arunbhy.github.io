import React, { useState } from "react";
import "./Skills.css";
import { skills } from "../../assets/files/SkillsDetails.js";
import ButtonLight from "../ButtonLight/ButtonLight";
import useInView from "../../hooks/useInView";

const SkillCard = ({ skill, index, visible, onToggle }) => {
    const [ref, isInView] = useInView();

    return (
        <div
            ref={ref}
            className={`skill-card ${index % 2 === 0 ? 'even' : 'odd'} ${visible ? 'expanded' : ''} ${isInView ? 'animate-in' : ''}`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <h5>{skill.title}</h5>
            {visible && (
                <ul>
                    {skill.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            )}
            <div className="show-button" onClick={onToggle}>
                <ButtonLight text={visible ? "Hide Skills" : "Show Skills"} />
            </div>
        </div>
    );
};

const Skills = () => {
    const [visibleSkills, setVisibleSkills] = useState(skills.map(() => false));
    const [titleRef, titleInView] = useInView();

    const toggleSkillVisibility = (index) => {
        setVisibleSkills(visibleSkills.map((visible, i) => (i === index ? !visible : visible)));
    };

    return (
        <div id="skills" className="skills">
            <h1 ref={titleRef} className={titleInView ? 'animate-in' : ''}>TECHNICAL SKILLS</h1>
            <div className="skills-row">
                {skills.map((skill, index) => (
                    <SkillCard
                        key={index}
                        skill={skill}
                        index={index}
                        visible={visibleSkills[index]}
                        onToggle={() => toggleSkillVisibility(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Skills;
