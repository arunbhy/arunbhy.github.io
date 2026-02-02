import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BackgroundEffects = () => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        // Create particles
        const createParticles = () => {
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'particles';
            document.body.appendChild(particlesContainer);

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size between 2px and 6px
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random starting position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random animation duration between 15s and 30s
                particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
                
                // Random delay
                particle.style.animationDelay = `${Math.random() * 5}s`;
                
                particlesContainer.appendChild(particle);
            }
        };

        // Handle scroll reveal
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

        // Clean up existing particles
        const cleanupParticles = () => {
            const existingParticles = document.querySelector('.particles');
            if (existingParticles) {
                existingParticles.remove();
            }
        };

        // Initial setup
        cleanupParticles();
        createParticles();
        window.addEventListener('scroll', handleScrollReveal);
        handleScrollReveal();

        return () => {
            window.removeEventListener('scroll', handleScrollReveal);
            cleanupParticles();
        };
    }, [isDarkMode]); // Recreate particles when theme changes

    return null;
};

export default BackgroundEffects; 