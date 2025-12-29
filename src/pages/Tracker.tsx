import React, { useState, useEffect } from 'react';
import { getTodayData, saveHealthData, getUserProfile, type HealthData, type UserProfile } from '../services/storageService';
import { motion } from 'framer-motion';
import { Plus, Minus, Calculator, Activity, Info, Calendar } from 'lucide-react';
import WaterBottle from '../components/WaterBottle';
import { useNavigate } from 'react-router-dom';

const Tracker: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<HealthData>({
        date: new Date().toISOString().split('T')[0],
        steps: 0,
        water: 0,
        sleep: 0,
        calories: 0,
        protein: 0
    });
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bmi, setBmi] = useState<number | null>(null);
    const [showBmi, setShowBmi] = useState(false);
    const [showBmiInfo, setShowBmiInfo] = useState(false);
    const [oneRepMax, setOneRepMax] = useState<number | null>(null);
    const [showRmInfo, setShowRmInfo] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const todayData = await getTodayData();
            setData(todayData);
            const userProfile = await getUserProfile();
            setProfile(userProfile);
        };
        loadData();
    }, []);

    const updateData = async (field: keyof HealthData, value: number) => {
        const newData = { ...data, [field]: Math.max(0, value) }; // Prevent negative
        setData(newData);
        await saveHealthData(newData);
    };

    const calculateBMI = () => {
        if (profile && profile.weight && profile.height) {
            const heightInMeters = profile.height / 100;
            const bmiValue = profile.weight / (heightInMeters * heightInMeters);
            setBmi(Number(bmiValue.toFixed(1)));
            setShowBmi(true);
        }
    };

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { label: 'Underweight', color: '#ff9800' };
        if (bmi < 25) return { label: 'Normal Weight', color: '#4CAF50' };
        if (bmi < 30) return { label: 'Overweight', color: '#ff9800' };
        return { label: 'Obese', color: '#f44336' };
    };

    const TrackerItem = ({ label, field, step, unit }: { label: string, field: keyof HealthData, step: number, unit: string }) => (
        <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '16px',
            marginBottom: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{label}</h4>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                    {data[field]} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{unit}</span>
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => updateData(field, Number(data[field]) - step)}
                    style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', color: 'black' }}
                >
                    <Minus size={20} />
                </button>
                <button
                    onClick={() => updateData(field, Number(data[field]) + step)}
                    style={{ padding: '8px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Daily Tracker</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Update your activities</p>
                </div>
                <button
                    onClick={() => navigate('/history')}
                    style={{
                        background: 'white',
                        border: '1px solid #eee',
                        borderRadius: '12px',
                        padding: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >
                    <Calendar size={24} color="var(--primary-color)" />
                </button>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Enhanced Water Intake Tracker */}
                <WaterBottle
                    current={data.water}
                    goal={2000}
                    onAdd={(amount) => updateData('water', data.water + amount)}
                />

                {/* Other Trackers */}
                <TrackerItem label="Reference Steps" field="steps" step={500} unit="steps" />
                <TrackerItem label="Sleep Duration" field="sleep" step={0.5} unit="hrs" />
                <TrackerItem label="Calories" field="calories" step={50} unit="kcal" />
                <TrackerItem label="Protein" field="protein" step={5} unit="g" />

                {/* 1RM Calculator Section */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    marginTop: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🏋️</span> One Rep Max (1RM)
                        </h3>
                        <button
                            onClick={() => setShowRmInfo(!showRmInfo)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                        >
                            <Info size={20} />
                        </button>
                    </div>

                    {showRmInfo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}
                        >
                            <strong>How is it calculated?</strong><br />
                            Uses the <em>Epley Formula</em>:<br />
                            1RM = Weight × (1 + Reps / 30)<br /><br />
                            <span style={{ fontSize: '0.8rem' }}>This gives an estimate potential max lift for 1 repetition.</span>
                        </motion.div>
                    )}

                    <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Estimate your max lift based on reps performed.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="e.g. 60"
                                id="rm-weight"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>Reps</label>
                            <input
                                type="number"
                                placeholder="e.g. 8"
                                id="rm-reps"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {!oneRepMax ? (
                            <button
                                onClick={() => {
                                    const weight = Number((document.getElementById('rm-weight') as HTMLInputElement).value);
                                    const reps = Number((document.getElementById('rm-reps') as HTMLInputElement).value);
                                    if (weight > 0 && reps > 0) {
                                        // Epley Formula
                                        const result = Math.round(weight * (1 + reps / 30));
                                        setOneRepMax(result);
                                    }
                                }}
                                style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '24px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Calculate 1RM
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                                    {oneRepMax} <span style={{ fontSize: '1.5rem', color: '#666' }}>kg</span>
                                </div>
                                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                                    Estimated One Rep Max
                                </p>
                                <button
                                    onClick={() => setOneRepMax(null)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid #ddd',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Recalculate
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* BMI Calculator Section */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    marginTop: '2rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={24} color="#e91e63" /> BMI Calculator
                        </h3>
                        <button
                            onClick={() => setShowBmiInfo(!showBmiInfo)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                        >
                            <Info size={20} />
                        </button>
                    </div>

                    {showBmiInfo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}
                        >
                            <strong>BMI Categories:</strong><br />
                            Less than 18.5: Underweight<br />
                            18.5 – 24.9: Normal Weight<br />
                            25 – 29.9: Overweight<br />
                            30 or more: Obese
                        </motion.div>
                    )}

                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                        Calculate your Body Mass Index based on your profile stats.
                    </p>

                    <div style={{ textAlign: 'center' }}>
                        {!showBmi ? (
                            <button
                                onClick={calculateBMI}
                                style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    padding: '10px 24px',
                                    borderRadius: '24px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '0 auto',
                                    fontWeight: 600
                                }}
                            >
                                <Calculator size={20} />
                                Calculate BMI
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: getBmiCategory(bmi!).color, marginBottom: '0.5rem' }}>
                                    {bmi}
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: `${getBmiCategory(bmi!).color}20`,
                                    color: getBmiCategory(bmi!).color,
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}>
                                    {getBmiCategory(bmi!).label}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Tracker;
