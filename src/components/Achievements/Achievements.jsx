import React from 'react';
import achievements from '../../assets/files/AchievementsDetails';
import useInView from '../../hooks/useInView';
import './Achievements.css';

const AchievementCard = ({ achievement, num }) => {
    const [ref, inView] = useInView();

    return (
        <div ref={ref} className={`pcard rev ${inView ? 'in' : ''}`}>
            <span className="pnum">{String(num).padStart(2, '0')}</span>

            <div className="pbody">
                <h3>{achievement.type}</h3>
                <div className="psub">{achievement.organization}</div>
                <p>{achievement.summary}</p>
            </div>

            <div className="plinks">
                <span className="pyear">{achievement.year}</span>
                {achievement.link && (
                    <a href={achievement.link} target="_blank" rel="noopener noreferrer">
                        {(achievement.linkText || 'View')} →
                    </a>
                )}
            </div>
        </div>
    );
};

const Achievements = () => {
    return (
        <section id="achievements" className="ed-section">
            <div className="wrap">
                <div className="sec-head">
                    <h2>Recognition</h2>
                    <span className="idx">05 / 06</span>
                </div>
                {achievements.map((achievement, index) => (
                    <AchievementCard key={index} achievement={achievement} num={index + 1} />
                ))}
            </div>
        </section>
    );
};

export default Achievements;
