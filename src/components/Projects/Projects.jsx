import React, { useState } from "react";
import useInView from "../../hooks/useInView";
import "./Projects.css";
import projectList from "../../assets/files/ProjectDetails.js";

const ProjectCard = ({ project, num, expanded, onToggle }) => {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className={`pcard rev ${inView ? "in" : ""} ${expanded ? "open" : ""}`}
            onClick={onToggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
        >
            <span className="pnum">{String(num).padStart(2, "0")}</span>

            <div className="pbody">
                <h3>{project.title}</h3>
                <div className="psub">{project.subtitle}</div>

                <div className="pcard-detail">
                    <div className="pcard-detail-inner">
                        {project.image && (
                            <img className="pcard-pic" src={project.image} alt={project.title} loading="lazy" />
                        )}
                        <div className="pcard-detail-text">
                            <p>{project.summary}</p>
                            {project.tags && (
                                <div className="tags">
                                    {project.tags.map((tag, i) => (
                                        <span className="tag" key={i}>{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="plinks">
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer">Repository →</a>
                                )}
                                {project.website && (
                                    <a href={project.website} target="_blank" rel="noopener noreferrer">Website →</a>
                                )}
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live demo →</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pmeta">
                <span className="pyear">{project.time}</span>
                <span className="pchevron">↓</span>
            </div>
        </div>
    );
};

const Projects = () => {
    const [showAll, setShowAll] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const displayed = showAll ? projectList : projectList.slice(0, 4);

    const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);

    return (
        <section id="projects" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Selected Projects</h2>
                    <span className="idx">03 / 06</span>
                </div>

                {displayed.map((project, index) => (
                    <ProjectCard
                        key={index}
                        project={project}
                        num={index + 1}
                        expanded={expandedIndex === index}
                        onToggle={() => toggle(index)}
                    />
                ))}

                {projectList.length > 4 && (
                    <button className="btn ghost projects-toggle" onClick={() => setShowAll(!showAll)}>
                        {showAll ? "Show less" : `Show all ${projectList.length} projects`} <span className="arr">→</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default Projects;
