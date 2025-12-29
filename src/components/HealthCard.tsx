import React from 'react';
import { motion } from 'framer-motion';

interface HealthCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
}

const HealthCard: React.FC<HealthCardProps> = ({ title, value, unit, icon, color, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{
                backgroundColor: 'var(--card-bg)',
                padding: '1.2rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: onClick ? 'pointer' : 'default',
                borderLeft: `4px solid ${color}`
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{title}</span>
                <div style={{ color: color }}>{icon}</div>
            </div>
            <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{value}</span>
                {unit && <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{unit}</span>}
            </div>
        </motion.div>
    );
};

export default HealthCard;
