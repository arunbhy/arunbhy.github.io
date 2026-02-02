import React, { useEffect, useRef, useState } from "react";
import "./Professional.css";
import { work } from "../../assets/files/WorkDetails.js";
import ButtonLight from "../ButtonLight/ButtonLight";

const Professional = () => {
    const [showAll, setShowAll] = useState(false);
    const workRefs = useRef([]);

    useEffect(() => {
        workRefs.current.slice(0, 3).forEach((ref, index) => {
            setTimeout(() => {
                if (ref) {
                    ref.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
                }
            }, index * 300);
        });
    }, []);

    const handleToggle = () => {
        setShowAll(!showAll);
    };

    useEffect(() => {
        if (showAll) {
            workRefs.current.slice(3).forEach((ref, index) => {
                setTimeout(() => {
                    if (ref) {
                        ref.classList.add(ref.classList.contains('even-card') ? 'slide-in-left' : 'slide-in-right');
                        ref.classList.remove('fade-out');
                    }
                }, index * 300);
            });
        } else {
            workRefs.current.slice(3).forEach((ref, index) => {
                setTimeout(() => {
                    if (ref) {
                        ref.classList.remove('slide-in-left', 'slide-in-right');
                        ref.classList.add('fade-out');
                    }
                }, index * 300);
            });
        }
    }, [showAll]);

    return (
        <div id="professional" className="professional">
            <h1>CAREER OVERVIEW</h1>
            {work.slice(0, showAll ? work.length : 3).map((item, index) => (
                <div
                    key={index}
                    className={`work-card ${index % 2 === 0 ? 'even-card' : 'odd-card'}`}
                    ref={(el) => (workRefs.current[index] = el)}
                >
                    <div className="work-card-content">
                        <img src={item.image} alt={item.name} className="work-image" />
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
            ))}
            <div onClick={handleToggle} className="button-light-container">
                <ButtonLight text={showAll ? "Show Less" : "Show More"} />
            </div>
        </div>
    );
};

export default Professional;
