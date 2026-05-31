import React, { useState } from 'react';
import achievements from '../../assets/files/AchievementsDetails';
import useInView from '../../hooks/useInView';
import './Achievements.css';

const AchievementCard = ({ achievement, num, expanded, onToggle }) => {
    const [ref, inView] = useInView();

    return (
        <div
            ref={ref}
            className={`pcard rev ${inView ? 'in' : ''} ${expanded ? 'open' : ''}`}
            onClick={onToggle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
        >
            <span className="pnum">{String(num).padStart(2, '0')}</span>

            <div className="pbody">
                <h3>{achievement.type}</h3>
                <div className="psub">{achievement.organization}</div>

                <div className="pcard-detail">
                    <div className="pcard-detail-inner">
                        {achievement.image && (
                            <img className="pcard-pic" src={achievement.image} alt={achievement.type} loading="lazy" />
                        )}
                        <div className="pcard-detail-text">
                            <p>{achievement.summary}</p>
                            {achievement.link && (
                                <div className="plinks">
                                    <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                                        {(achievement.linkText || 'View')} →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pmeta">
                <span className="pyear">{achievement.year}</span>
                <span className="pchevron">↓</span>
            </div>
        </div>
    );
};

const Achievements = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const toggle = (i) => setExpandedIndex(expandedIndex === i ? null : i);

    return (
        <section id="achievements" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Recognition</h2>
                    <span className="idx">05 / 06</span>
                </div>
                {achievements.map((achievement, index) => (
                    <AchievementCard
                        key={index}
                        achievement={achievement}
                        num={index + 1}
                        expanded={expandedIndex === index}
                        onToggle={() => toggle(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Achievements;
