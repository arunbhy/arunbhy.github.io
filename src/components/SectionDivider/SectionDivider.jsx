import React, { useMemo } from 'react';
import './SectionDivider.css';

const ScatterPlot = () => {
    const points = useMemo(() => {
        const pts = [];
        // Two clusters
        for (let i = 0; i < 20; i++) {
            pts.push({
                cx: 150 + Math.random() * 200 - 100 + (Math.random() > 0.5 ? 300 : 0),
                cy: 20 + Math.random() * 40,
                r: 2 + Math.random() * 2,
                cluster: Math.random() > 0.5 ? 0 : 1,
            });
        }
        return pts;
    }, []);

    return (
        <svg className="section-divider-svg" viewBox="0 0 600 80" preserveAspectRatio="none">
            {/* Subtle axis lines */}
            <line x1="50" y1="70" x2="550" y2="70" className="divider-axis" />
            <line x1="50" y1="10" x2="50" y2="70" className="divider-axis" />
            {/* Data points */}
            {points.map((p, i) => (
                <circle
                    key={i}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    className={`divider-point ${p.cluster === 0 ? 'cluster-a' : 'cluster-b'}`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                />
            ))}
            {/* Decision boundary */}
            <line x1="300" y1="8" x2="300" y2="72" className="divider-boundary" />
        </svg>
    );
};

const LossCurve = () => {
    // Smooth loss curve going down
    const path = "M 50,65 C 100,60 120,45 160,35 S 220,18 280,14 S 360,12 420,11 S 500,10 550,10";
    const valPath = "M 50,68 C 100,62 130,50 170,42 S 230,28 290,22 S 370,20 430,19 S 510,18 550,18";

    return (
        <svg className="section-divider-svg" viewBox="0 0 600 80" preserveAspectRatio="none">
            <line x1="50" y1="70" x2="550" y2="70" className="divider-axis" />
            <line x1="50" y1="10" x2="50" y2="70" className="divider-axis" />
            {/* Training loss */}
            <path d={path} className="divider-curve curve-train" fill="none" />
            {/* Validation loss */}
            <path d={valPath} className="divider-curve curve-val" fill="none" />
            {/* Labels */}
            <text x="555" y="13" className="divider-label">train</text>
            <text x="555" y="21" className="divider-label label-val">val</text>
        </svg>
    );
};

const ConfusionGrid = () => {
    const cells = [
        { x: 0, y: 0, opacity: 0.9 }, { x: 1, y: 0, opacity: 0.1 }, { x: 2, y: 0, opacity: 0.05 },
        { x: 0, y: 1, opacity: 0.15 }, { x: 1, y: 1, opacity: 0.85 }, { x: 2, y: 1, opacity: 0.08 },
        { x: 0, y: 2, opacity: 0.05 }, { x: 1, y: 2, opacity: 0.12 }, { x: 2, y: 2, opacity: 0.92 },
    ];

    return (
        <svg className="section-divider-svg" viewBox="0 0 600 80" preserveAspectRatio="none">
            <g transform="translate(225, 5)">
                {cells.map((cell, i) => (
                    <rect
                        key={i}
                        x={cell.x * 25}
                        y={cell.y * 23}
                        width="23"
                        height="21"
                        rx="2"
                        className="divider-cell"
                        style={{ opacity: cell.opacity * 0.3, animationDelay: `${i * 0.1}s` }}
                    />
                ))}
            </g>
            {/* Scatter dots on sides */}
            {Array.from({ length: 12 }, (_, i) => (
                <circle
                    key={`l${i}`}
                    cx={60 + Math.sin(i * 1.2) * 40 + i * 10}
                    cy={15 + Math.cos(i * 0.8) * 25 + 20}
                    r={1.5}
                    className="divider-point cluster-a"
                    style={{ animationDelay: `${i * 0.12}s` }}
                />
            ))}
            {Array.from({ length: 12 }, (_, i) => (
                <circle
                    key={`r${i}`}
                    cx={340 + Math.sin(i * 1.5) * 40 + i * 15}
                    cy={15 + Math.cos(i * 0.9) * 25 + 20}
                    r={1.5}
                    className="divider-point cluster-b"
                    style={{ animationDelay: `${i * 0.12}s` }}
                />
            ))}
        </svg>
    );
};

const dividerTypes = { scatter: ScatterPlot, loss: LossCurve, grid: ConfusionGrid };

const SectionDivider = ({ type = 'scatter' }) => {
    const Component = dividerTypes[type] || ScatterPlot;
    return (
        <div className="section-divider">
            <Component />
        </div>
    );
};

export default SectionDivider;
