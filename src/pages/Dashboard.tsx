import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getTodayData, type UserProfile, type HealthData } from '../services/storageService';
import { calculateBMI, getBMICategory, calculateWaterGoal } from '../services/healthService';
import HealthCard from '../components/HealthCard';
import { Footprints, Droplets, Moon, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [todayData, setTodayData] = useState<HealthData | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            const user = await getUserProfile();
            if (!user) {
                // If no profile found in DB, maybe redirect to onboarding? 
                // Or login if session is invalid (but session is checked by authService)
                // Let's assume if no profile -> onboarding.
                navigate('/onboarding');
                return;
            }
            setProfile(user);
            const data = await getTodayData();
            setTodayData(data);
        };
        loadDashboard();
    }, [navigate]);

    if (!profile || !todayData) return null;

    const bmi = calculateBMI(profile.height, profile.weight);
    const { category, color } = getBMICategory(bmi);
    const waterGoal = calculateWaterGoal(profile.weight);

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Hello, {profile.name || 'Friend'}</h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Let's check your progress</p>
                </div>
                <div
                    onClick={() => navigate('/profile')}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    {profile.gender === 'female' ? '👩' : '👨'}
                </div>
            </header>

            {/* BMI Widget */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    marginBottom: '24px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', opacity: 0.9, color: 'white' }}>BMI Score</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{bmi}</div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', display: 'inline-block', fontSize: '0.9rem' }}>
                            {category}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Height</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>{profile.height} cm</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Weight</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{profile.weight} kg</div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <h3 style={{ marginBottom: '16px' }}>Today's Activity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <HealthCard
                    title="Steps"
                    value={todayData.steps}
                    unit="steps"
                    icon={<Footprints size={20} />}
                    color="#FF9800"
                    onClick={() => navigate('/track')}
                />
                <HealthCard
                    title="Water"
                    value={(todayData.water / 1000).toFixed(1)}
                    unit={`/ ${(waterGoal / 1000).toFixed(1)} L`}
                    icon={<Droplets size={20} />}
                    color="#2196F3"
                    onClick={() => navigate('/track')}
                />
                <HealthCard
                    title="Sleep"
                    value={todayData.sleep}
                    unit="hrs"
                    icon={<Moon size={20} />}
                    color="#673AB7"
                    onClick={() => navigate('/track')}
                />
                <HealthCard
                    title="Calories"
                    value={todayData.calories}
                    unit="kcal"
                    icon={<Flame size={20} />}
                    color="#F44336"
                    onClick={() => navigate('/track')}
                />
            </div>

        </div>
    );
};

export default Dashboard;
