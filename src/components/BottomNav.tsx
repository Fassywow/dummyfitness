import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: <Home size={24} /> },
        { name: 'Track', path: '/track', icon: <PlusCircle size={24} /> },
        { name: 'Ask AI', path: '/ask-ai', icon: <MessageCircle size={24} /> },
        { name: 'Profile', path: '/profile', icon: <User size={24} /> },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '10px 0',
            zIndex: 1000,
            // Ensure it stays within the mobile width limit if constrained by Layout
            maxWidth: '480px',
            margin: '0 auto'
        }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <motion.div
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                        }}
                    >
                        {item.icon}
                        <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>{item.name}</span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default BottomNav;
