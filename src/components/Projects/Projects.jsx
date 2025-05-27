import React, { useState } from "react";
import ButtonLight from "../ButtonLight/ButtonLight";
import "./Projects.css";
import projectList from "../../assets/files/ProjectDetails.js";

const Projects = () => {
    const [showAllProjects, setShowAllProjects] = useState(false);

    const toggleProjects = () => {
        setShowAllProjects(!showAllProjects);
    };

    const displayedProjects = showAllProjects ? projectList : projectList.slice(0, 3);

    return (
        <div id="projects" className="projects">
            <h1>PROJECTS</h1>
            {displayedProjects.map((project, index) => (
                <div
                    className="project-card"
                    key={index}
                    style={{
                        animationDelay: "500ms"
                    }}
                >
                    <div
                        className="project-card-left"
                        style={{
                            animationDelay: "500ms"
                        }}
                    >
                        <img src={project.image} alt="project image not available" />
                    </div>
                    <div
                        className="project-card-right"
                        style={{
                            animationDelay: "500ms"
                        }}
                    >
                        <div className="project-card-right-header">
                            <h3>{project.title}</h3>
                            <span>{project.time}</span>
                        </div>
                        <h4>{project.subtitle}</h4>
                        <p>{project.summary}</p>
                        <a href={project.link} target="_blank"><ButtonLight text="View Repository" /></a>
                    </div>
                </div>
            ))}
            {projectList.length > 3 && (
                <div className="toggle-button" onClick={toggleProjects}>
                    <ButtonLight text={showAllProjects ? "Show Less" : "Show More"} />
                </div>
            )}
        </div>
    );
};

export default Projects;
