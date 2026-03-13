import React, { useMemo, useState } from "react";
import "./Timeline.css";
import { work } from "../../assets/files/WorkDetails.js";
import { education } from "../../assets/files/EducationDetails.js";
import useInView from "../../hooks/useInView";

const MONTH_MAP = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const parseStartDate = (timeStr) => {
    const clean = timeStr.split("·")[0].split("-")[0].trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
        const month = MONTH_MAP[parts[0].toLowerCase()] ?? 0;
        const year = parseInt(parts[1], 10);
        return new Date(year, month);
    }
    return new Date(0);
};

const formatYear = (timeStr) => {
    const clean = timeStr.split("·")[0].split("-")[0].trim();
    const parts = clean.split(/\s+/);
    return parts.length >= 2 ? parts[1] : "";
};

const TimelineItem = ({ item, index, expanded, onToggle }) => {
    const [ref, isInView] = useInView();
    const side = index % 2 === 0 ? "left" : "right";

    return (
        <div
            ref={ref}
            className={`timeline-item timeline-${side} ${isInView ? "animate-in" : ""}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="timeline-dot-wrapper">
                <div className={`timeline-dot timeline-dot--${item.type}`}>
                    <i className={item.icon}></i>
                </div>
            </div>
            <div
                className={`timeline-card timeline-card--${item.type} ${expanded ? "timeline-card--expanded" : ""}`}
                onClick={onToggle}
            >
                <div className="timeline-card-header">
                    <div className="timeline-card-header-text">
                        <span className="timeline-year">{item.year}</span>
                        <h3 className="timeline-title">{item.title}</h3>
                        <p className="timeline-subtitle">{item.subtitle}</p>
                    </div>
                    <i className={`fa-solid fa-chevron-${expanded ? "up" : "down"} timeline-chevron`}></i>
                </div>

                {expanded && (
                    <div className="timeline-expanded">
                        {item.image && (
                            <img src={item.image} alt={item.title} className="timeline-expanded-img" loading="lazy" />
                        )}
                        {item.time && (
                            <p className="timeline-time">
                                <i className="fa-regular fa-calendar"></i> {item.time}
                            </p>
                        )}
                        {item.location && (
                            <p className="timeline-location">
                                <i className="fa-solid fa-location-dot"></i> {item.location}
                            </p>
                        )}
                        {item.summary && (
                            <div className="timeline-summary">
                                {item.summary.split("\n").map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}
                        {item.coursework && (
                            <div className="timeline-coursework">
                                <p className="timeline-coursework-label">Coursework</p>
                                <ul>
                                    {item.coursework.map((course, i) => (
                                        <li key={i}>{course}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Timeline = () => {
    const [titleRef, titleInView] = useInView();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const items = useMemo(() => {
        const workItems = work.map((w) => ({
            type: "work",
            icon: "fa-solid fa-briefcase",
            year: formatYear(w.time),
            title: w.role,
            subtitle: w.name,
            image: w.image,
            time: w.time,
            location: w.location,
            summary: w.summary,
            sortDate: parseStartDate(w.time),
        }));

        const eduItems = education.map((e) => ({
            type: "education",
            icon: "fa-solid fa-graduation-cap",
            year: formatYear(e.time),
            title: e.degree,
            subtitle: e.name,
            image: e.image,
            time: e.time,
            location: e.location,
            coursework: e.coursework,
            sortDate: parseStartDate(e.time),
        }));

        return [...workItems, ...eduItems].sort((a, b) => b.sortDate - a.sortDate);
    }, []);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div id="timeline" className="timeline-section">
            <h1 ref={titleRef} className={titleInView ? "animate-in" : ""}>
                MY JOURNEY
            </h1>
            <div className="timeline-container">
                <div className="timeline-line"></div>
                {items.map((item, index) => (
                    <TimelineItem
                        key={index}
                        item={item}
                        index={index}
                        expanded={expandedIndex === index}
                        onToggle={() => toggleExpand(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
