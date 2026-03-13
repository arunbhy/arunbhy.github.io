import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BackgroundEffects = () => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 15 : 35;

        const createParticles = () => {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles';
            document.body.appendChild(particlesContainer);

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
                particle.style.animationDelay = `${Math.random() * 5}s`;

                particlesContainer.appendChild(particle);
            }
        };

        const handleScrollReveal = () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        };

        const cleanupParticles = () => {
            const existingParticles = document.querySelector('.particles');
            if (existingParticles) {
                existingParticles.remove();
            }
        };

        cleanupParticles();
        createParticles();
        window.addEventListener('scroll', handleScrollReveal);
        handleScrollReveal();

        return () => {
            window.removeEventListener('scroll', handleScrollReveal);
            cleanupParticles();
        };
    }, [isDarkMode]);

    return null;
};

export default BackgroundEffects;
