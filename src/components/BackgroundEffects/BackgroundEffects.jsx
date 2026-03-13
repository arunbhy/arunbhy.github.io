import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BackgroundEffects = () => {
    const { isDarkMode } = useTheme();
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.className = 'neural-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;

        const ctx = canvas.getContext('2d');
        const isMobile = window.innerWidth <= 768;
        const nodeCount = isMobile ? 25 : 60;
        const connectionDistance = isMobile ? 120 : 180;

        let width, height;
        const nodes = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        resize();

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1.5,
                pulsePhase: Math.random() * Math.PI * 2,
            });
        }

        const primaryRGB = isDarkMode ? [204, 41, 54] : [8, 65, 92];
        const secondaryRGB = isDarkMode ? [8, 65, 92] : [204, 41, 54];

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update & draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                node.pulsePhase += 0.015;
                const pulse = 0.5 + 0.5 * Math.sin(node.pulsePhase);

                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.15;
                        const r = primaryRGB[0] + (secondaryRGB[0] - primaryRGB[0]) * (dist / connectionDistance);
                        const g = primaryRGB[1] + (secondaryRGB[1] - primaryRGB[1]) * (dist / connectionDistance);
                        const b = primaryRGB[2] + (secondaryRGB[2] - primaryRGB[2]) * (dist / connectionDistance);

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Draw node
                const nodeOpacity = 0.2 + pulse * 0.25;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + pulse * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${primaryRGB[0]},${primaryRGB[1]},${primaryRGB[2]},${nodeOpacity})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 4 + pulse * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${primaryRGB[0]},${primaryRGB[1]},${primaryRGB[2]},${nodeOpacity * 0.15})`;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', resize);

        // Scroll reveal
        const handleScrollReveal = () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - 150) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', handleScrollReveal, { passive: true });
        handleScrollReveal();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', handleScrollReveal);
            canvas.remove();
        };
    }, [isDarkMode]);

    return null;
};

export default BackgroundEffects;
