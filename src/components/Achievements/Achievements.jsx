import React, { useState } from 'react';
import achievements from '../../assets/files/AchievementsDetails';
import ButtonLight from '../ButtonLight/ButtonLight';
import './Achievements.css';

const Achievements = () => {
    const [showAllAchievements, setShowAllAchievements] = useState(false);

    const toggleAchievements = () => {
        setShowAllAchievements(!showAllAchievements);
    };

    const displayedAchievements = showAllAchievements ? achievements : achievements.slice(0, 3);

    const handleImageError = (e) => {
        e.target.src = '/images/logo.webp'; // Fallback to your logo
    };

    return (
        <div id="achievements" className="achievements">
            <h1>ACHIEVEMENTS</h1>
            {displayedAchievements.map((achievement, index) => (
                <div
                    className="achievement-card"
                    key={index}
                    style={{
                        animationDelay: "500ms"
                    }}
                >
                    <div
                        className="achievement-card-left"
                        style={{
                            animationDelay: "500ms"
                        }}
                    >
                        <img 
                            src={achievement.image} 
                            alt={achievement.type} 
                            onError={handleImageError}
                        />
                    </div>
                    <div
                        className="achievement-card-right"
                        style={{
                            animationDelay: "500ms"
                        }}
                    >
                        <div className="achievement-card-right-header">
                            <h3>{achievement.type}</h3>
                            <span>{achievement.year}</span>
                        </div>
                        <h4>{achievement.organization}</h4>
                        <p>{achievement.summary}</p>
                        {achievement.link && (
                            <a
                                href={achievement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="achievement-link-button"
                            >
                                {achievement.linkText || "View Details"}
                            </a>
                        )}
                    </div>
                </div>
            ))}
            {achievements.length > 3 && (
                <div className="toggle-button" onClick={toggleAchievements}>
                    <ButtonLight text={showAllAchievements ? "Show Less" : "Show More"} />
                </div>
            )}
        </div>
    );
};

export default Achievements; 