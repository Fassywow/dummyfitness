import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, type UserProfile } from '../services/storageService';
import { logout } from '../services/authService';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const user = await getUserProfile();
            setProfile(user);
        };
        loadProfile();
    }, []);

    if (!profile) return null;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Profile</h1>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'var(--primary-color)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                    }}>
                        {profile.gender === 'female' ? '👩' : '👨'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0 }}>My Health Profile</h3>
                        <span style={{ color: 'var(--text-secondary)' }}>{profile.age} years old</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Height</div>
                        <div style={{ fontWeight: 600 }}>{profile.height} cm</div>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Weight</div>
                        <div style={{ fontWeight: 600 }}>{profile.weight} kg</div>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Blood Group</div>
                        <div style={{ fontWeight: 600 }}>{profile.bloodGroup}</div>
                    </div>
                    <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Gender</div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{profile.gender}</div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate('/onboarding')}
                style={{ width: '100%', marginBottom: '12px', background: 'var(--secondary-color)' }}
            >
                Edit Profile
            </button>

            <button
                onClick={logout}
                style={{ width: '100%', background: '#ff5252' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
