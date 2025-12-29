import React, { useState } from 'react';
import { saveUserProfile, type UserProfile } from '../services/storageService';
import { motion } from 'framer-motion';

const Onboarding: React.FC = () => {
    const [formData, setFormData] = useState<UserProfile>({
        age: 25,
        height: 170, // cm
        weight: 70, // kg
        bloodGroup: 'O+',
        gender: 'male'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'bloodGroup' || name === 'gender' ? value : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveUserProfile(formData);
        // Force page reload to trigger auth check in App.tsx
        window.location.href = '/dashboard';
    };

    return (
        <div style={{ padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1>Setup Profile</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Let's verify your health stats to personalize your experience.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Blood Group</label>
                            <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                                placeholder="O+"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Height (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <input type="range" min="100" max="250" name="height" value={formData.height} onChange={handleChange} style={{ width: '100%', marginTop: '0.5rem' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Weight (kg)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>

                    <button type="submit" style={{ marginTop: '1rem' }}>Let's Go</button>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
