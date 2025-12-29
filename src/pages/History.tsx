import React, { useState, useEffect } from 'react';
import { getHealthHistory, type HealthData } from '../services/storageService';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Activity, Droplet, Moon, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
    const [history, setHistory] = useState<HealthData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getHealthHistory();
            setHistory(data);
            setLoading(false);
        };
        loadHistory();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                <button
                    onClick={() => navigate('/track')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>History</h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading history...</div>
            ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No history found yet. Start tracking today!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((day, index) => (
                        <motion.div
                            key={day.date}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                backgroundColor: 'white',
                                padding: '1.2rem',
                                borderRadius: '16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>
                                    {formatDate(day.date)}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{day.date}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Droplet size={16} color="#2196F3" />
                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                        {day.water} <span style={{ fontSize: '0.7rem' }}>ml</span>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={16} color="#4CAF50" />
                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                        {day.steps} <span style={{ fontSize: '0.7rem' }}>steps</span>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Moon size={16} color="#673AB7" />
                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                        {day.sleep} <span style={{ fontSize: '0.7rem' }}>hrs</span>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Timer size={16} color="#FF9800" />
                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                        {day.calories} <span style={{ fontSize: '0.7rem' }}>kcal</span>
                                    </span>
                                </div>
                                {day.protein !== undefined && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px' }}>🥩</span>
                                        <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                            {day.protein} <span style={{ fontSize: '0.7rem' }}>g</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
