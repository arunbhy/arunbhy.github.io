import React, { useState } from 'react';
import achievements from '../../assets/files/AchievementsDetails';
import ButtonLight from '../ButtonLight/ButtonLight';
import useInView from '../../hooks/useInView';
import './Achievements.css';

const AchievementCard = ({ achievement, index }) => {
    const [ref, isInView] = useInView();

    const handleImageError = (e) => {
        e.target.src = 'images/logo.webp';
    };

    return (
        <div
            ref={ref}
            className={`achievement-card ${isInView ? 'animate-in' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="achievement-card-left">
                <img
                    src={achievement.image}
                    alt={achievement.type}
                    loading="lazy"
                    onError={handleImageError}
                />
            </div>
            <div className="achievement-card-right">
                <div className="achievement-card-right-header">
                    <h3>{achievement.type}</h3>
                    <span>{achievement.year}</span>
                </div>
                <h4>{achievement.organization}</h4>
                <p>{achievement.summary}</p>
                {achievement.link && (
                    <ButtonLight
                        text={achievement.linkText || "View Details"}
                        link={achievement.link}
                    />
                )}
            </div>
        </div>
    );
};

const Achievements = () => {
    const [showAllAchievements, setShowAllAchievements] = useState(false);
    const [titleRef, titleInView] = useInView();

    const toggleAchievements = () => {
        setShowAllAchievements(!showAllAchievements);
    };

    const displayedAchievements = showAllAchievements ? achievements : achievements.slice(0, 3);

    return (
        <section id="achievements" className="achievements">
            <h1 ref={titleRef} className={titleInView ? 'animate-in' : ''}>ACHIEVEMENTS</h1>
            {displayedAchievements.map((achievement, index) => (
                <AchievementCard key={index} achievement={achievement} index={index} />
            ))}
            {achievements.length > 3 && (
                <div className="toggle-button" onClick={toggleAchievements}>
                    <ButtonLight
                        text={showAllAchievements ? "Show Less" : "Show More"}
                    />
                </div>
            )}
        </section>
    );
};

export default Achievements;
