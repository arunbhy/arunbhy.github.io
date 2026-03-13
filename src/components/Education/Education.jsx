import React, { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import "./Education.css";
import { education } from "../../assets/files/EducationDetails.js";
import ButtonLight from "../ButtonLight/ButtonLight";

const Education = () => {
    const [showCoursework, setShowCoursework] = useState(education.map(() => false));

    const toggleCoursework = (index) => {
        setShowCoursework(showCoursework.map((v, i) => (i === index ? !v : v)));
    };

    return (
        <div id="education" className="education">
            <h1>EDUCATION</h1>

            <div className="education-card-row">
                {education.map((edu, index) => (
                    <div key={index} id={index === 0 ? "masters" : "bachelors"} className="degree">
                        <img src={edu.image} alt={edu.name} className="degree-img" loading="lazy" />
                        <div className="degree-header">
                            <h2>{edu.name}</h2>
                            <span className="degree-date">{edu.time}</span>
                        </div>
                        <h5>{edu.location}</h5>
                        <p>{edu.degree}</p>
                        <div className="coursework">
                            <div className="button-light-container" onClick={() => toggleCoursework(index)}>
                                <ButtonLight text={showCoursework[index] ? "Hide Coursework" : "Show Coursework"} />
                            </div>
                            {showCoursework[index] && (
                                <ListGroup variant="flush" className="coursework-list">
                                    {edu.coursework.map((course, i) => (
                                        <ListGroup.Item key={i} className="coursework-item">{course}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Education;
