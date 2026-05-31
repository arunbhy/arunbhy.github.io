import React from "react";
import "./Skills.css";
import { skills } from "../../assets/files/SkillsDetails.js";
import useInView from "../../hooks/useInView";

const SkillRow = ({ skill, index }) => {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={`srow rev ${inView ? "in" : ""}`}
            style={{ transitionDelay: `${index * 60}ms` }}
        >
            <span className="scat">{skill.title}</span>
            <div className="sitems">
                {skill.content.map((item, i) => (
                    <span className="tag" key={i}>{item}</span>
                ))}
            </div>
        </div>
    );
};

const Skills = () => {
    return (
        <section id="skills" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Skills</h2>
                    <span className="idx">04 / 06</span>
                </div>
                <div className="skill-rows">
                    {skills.map((skill, index) => (
                        <SkillRow key={index} skill={skill} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
