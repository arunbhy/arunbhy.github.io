import React, { useState } from "react";
import ButtonLight from "../ButtonLight/ButtonLight";
import useInView from "../../hooks/useInView";
import "./Projects.css";
import projectList from "../../assets/files/ProjectDetails.js";

const ProjectCard = ({ project, index }) => {
    const [ref, isInView] = useInView();

    return (
        <div
            ref={ref}
            className={`project-card ${isInView ? 'animate-in' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="project-card-left">
                <img src={project.image} alt={project.title} loading="lazy" />
            </div>
            <div className="project-card-right">
                <div className="project-card-right-header">
                    <h3>{project.title}</h3>
                    <span>{project.time}</span>
                </div>
                <h4>{project.subtitle}</h4>
                {project.tags && (
                    <div className="project-tags">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="project-tag">{tag}</span>
                        ))}
                    </div>
                )}
                <p>{project.summary}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ButtonLight text="View Repository" />
                </a>
            </div>
        </div>
    );
};

const Projects = () => {
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [titleRef, titleInView] = useInView();

    const toggleProjects = () => {
        setShowAllProjects(!showAllProjects);
    };

    const displayedProjects = showAllProjects ? projectList : projectList.slice(0, 3);

    return (
        <section id="projects" className="projects">
            <h1 ref={titleRef} className={titleInView ? 'animate-in' : ''}>PROJECTS</h1>
            {displayedProjects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
            ))}
            {projectList.length > 3 && (
                <div className="toggle-button" onClick={toggleProjects}>
                    <ButtonLight text={showAllProjects ? "Show Less" : "Show More"} />
                </div>
            )}
        </section>
    );
};

export default Projects;
