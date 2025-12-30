import React, { useState, useEffect } from 'react';
import { getHealthHistory, type HealthData } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics: React.FC = () => {
    const [data, setData] = useState<HealthData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const history = await getHealthHistory();
            // Take last 7 days and reverse to show oldest to newest left-to-right
            setData(history.slice(0, 7).reverse());
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading analysis...</div>;
    }

    if (data.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h3>No data to analyze yet!</h3>
                <p>Start tracking your daily activities to see trends here.</p>
            </div>
        );
    }

    // Format date for X-Axis (e.g., "Mon", "Dec 30")
    const formatXAxis = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}
                >
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={{ margin: 0 }}>Health Trends 📊</h1>
                <p style={{ color: '#666' }}>Your progress over the last 7 days</p>
            </div>

            {/* Water Chart */}
            <div style={{ background: 'white', padding: '15px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#2196F3' }}>Water Intake</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickFormatter={formatXAxis} fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                labelFormatter={(label) => new Date(label).toDateString()}
                            />
                            <Bar dataKey="water" fill="#2196F3" radius={[4, 4, 0, 0]} name="Water (ml)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', margin: '10px 0 0 0' }}>Goal: 2000ml / day</p>
            </div>

            {/* Steps Chart */}
            <div style={{ background: 'white', padding: '15px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#4CAF50' }}>Steps</h3>
                <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickFormatter={formatXAxis} fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                labelFormatter={(label) => new Date(label).toDateString()}
                            />
                            <Line type="monotone" dataKey="steps" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4 }} name="Steps" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', margin: '10px 0 0 0' }}>Goal: 10,000 steps / day</p>
            </div>
        </div>
    );
};

export default Analytics;
