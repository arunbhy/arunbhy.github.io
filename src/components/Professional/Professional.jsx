import React, { useState } from "react";
import "./Professional.css";
import { work } from "../../assets/files/WorkDetails.js";
import ButtonLight from "../ButtonLight/ButtonLight";
import useInView from "../../hooks/useInView";

const WorkCard = ({ item, index }) => {
    const [ref, isInView] = useInView();

    return (
        <div
            ref={ref}
            className={`work-card ${index % 2 === 0 ? 'even-card' : 'odd-card'} ${isInView ? 'animate-in' : ''}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="work-card-content">
                <img src={item.image} alt={item.name} className="work-image" loading="lazy" />
                <div className="work-details">
                    <div className="work-header">
                        <h3>{item.name}</h3>
                        <span>{item.time}</span>
                    </div>
                    <div>
                        <h4>{item.location}</h4>
                        <h5>{item.role}</h5>
                        <p>{item.summary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Professional = () => {
    const [showAll, setShowAll] = useState(false);
    const [titleRef, titleInView] = useInView();

    const handleToggle = () => {
        setShowAll(!showAll);
    };

    return (
        <div id="professional" className="professional">
            <h1 ref={titleRef} className={titleInView ? 'animate-in' : ''}>CAREER OVERVIEW</h1>
            {work.slice(0, showAll ? work.length : 3).map((item, index) => (
                <WorkCard key={index} item={item} index={index} />
            ))}
            {work.length > 3 && (
                <div onClick={handleToggle} className="button-light-container">
                    <ButtonLight text={showAll ? "Show Less" : "Show More"} />
                </div>
            )}
        </div>
    );
};

export default Professional;
