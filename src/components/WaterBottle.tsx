import React from 'react';
import { motion } from 'framer-motion';

interface WaterBottleProps {
    current: number;  // Current water intake in ml
    goal: number;     // Daily goal in ml
    onAdd: (amount: number) => void;
}

const WaterBottle: React.FC<WaterBottleProps> = ({ current, goal, onAdd }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const fillHeight = (percentage / 100) * 200; // 200 is the bottle height

    // Color based on progress
    const getColor = () => {
        if (percentage >= 100) return '#4CAF50'; // Green when goal reached
        if (percentage >= 75) return '#2196F3';  // Blue
        if (percentage >= 50) return '#03A9F4';  // Light blue
        return '#B3E5FC';                        // Very light blue
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Water Bottle SVG */}
            <svg width="120" height="280" viewBox="0 0 120 280" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                {/* Bottle Cap */}
                <rect x="45" y="10" width="30" height="15" rx="3" fill="#666" />
                <rect x="40" y="25" width="40" height="10" rx="2" fill="#888" />

                {/* Bottle Neck */}
                <path d="M 42 35 L 40 50 L 80 50 L 78 35 Z" fill="#E0E0E0" stroke="#999" strokeWidth="1" />

                {/* Main Bottle Body */}
                <rect x="20" y="50" width="80" height="210" rx="10" fill="white" stroke="#999" strokeWidth="2" />

                {/* Water Fill with Animation */}
                <motion.rect
                    x="22"
                    y={260 - fillHeight}
                    width="76"
                    height={fillHeight}
                    rx="8"
                    fill={getColor()}
                    initial={{ height: 0, y: 260 }}
                    animate={{ height: fillHeight, y: 260 - fillHeight }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ opacity: 0.8 }}
                />

                {/* Water Wave Effect (top of water) */}
                {fillHeight > 0 && (
                    <motion.ellipse
                        cx="60"
                        cy={260 - fillHeight}
                        rx="38"
                        ry="4"
                        fill={getColor()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                {/* Measurement Lines */}
                <line x1="25" y1="110" x2="35" y2="110" stroke="#ccc" strokeWidth="1" />
                <line x1="25" y1="170" x2="35" y2="170" stroke="#ccc" strokeWidth="1" />
                <line x1="25" y1="230" x2="35" y2="230" stroke="#ccc" strokeWidth="1" />
            </svg>

            {/* Progress Text */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getColor() }}>
                    {current}ml
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    / {goal}ml ({Math.round(percentage)}%)
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', maxWidth: '200px', height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', backgroundColor: getColor(), borderRadius: '4px' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Quick Add Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button
                    onClick={() => onAdd(-250)}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '20px', background: 'white', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    -250
                </button>
                <button
                    onClick={() => onAdd(250)}
                    style={{ padding: '8px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    +250ml
                </button>
                <button
                    onClick={() => onAdd(500)}
                    style={{ padding: '8px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    +500ml
                </button>
            </div>

            {/* Goal Status */}
            {percentage >= 100 && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 600
                    }}
                >
                    🎉 Daily Goal Achieved!
                </motion.div>
            )}
        </div>
    );
};

export default WaterBottle;
