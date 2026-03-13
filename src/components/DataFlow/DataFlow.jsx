import React, { useEffect, useRef } from 'react';
import './DataFlow.css';

const DataFlow = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const isMobile = window.innerWidth <= 768;
        const columnCount = isMobile ? 4 : 8;
        const fragments = [];

        const dataSnippets = [
            'loss: 0.0342',
            'acc: 0.9847',
            'epoch: 128',
            'lr: 3e-4',
            '[0.94, 0.12, 0.67]',
            'grad: 0.0021',
            'batch: 64',
            'f1: 0.923',
            'dim: 768',
            'heads: 12',
            'dropout: 0.1',
            'params: 110M',
            'λ = 0.001',
            'σ(Wx + b)',
            'softmax(QK/√d)',
            'BLEU: 42.3',
            'P(y|x) = 0.97',
            '∇L(θ)',
            'ReLU(z)',
            'val_acc: 0.96',
            'precision: 0.91',
            'recall: 0.88',
            'AUC: 0.953',
            'latent_dim: 256',
        ];

        for (let col = 0; col < columnCount; col++) {
            const column = document.createElement('div');
            column.className = 'data-column';
            column.style.left = `${(col / columnCount) * 100 + Math.random() * (100 / columnCount / 2)}%`;
            column.style.animationDuration = `${18 + Math.random() * 15}s`;
            column.style.animationDelay = `${Math.random() * 10}s`;

            const itemCount = 6 + Math.floor(Math.random() * 4);
            for (let i = 0; i < itemCount; i++) {
                const item = document.createElement('span');
                item.className = 'data-item';
                item.textContent = dataSnippets[Math.floor(Math.random() * dataSnippets.length)];
                column.appendChild(item);
            }

            container.appendChild(column);
            fragments.push(column);
        }

        return () => {
            fragments.forEach(col => col.remove());
        };
    }, []);

    return <div ref={containerRef} className="data-flow" />;
};

export default DataFlow;
