import React, { useState } from 'react';
import { sendOtp, verifyOtp } from '../services/authService';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [verificationId, setVerificationId] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) return;
        setLoading(true);
        try {
            const vId = await sendOtp(phoneNumber);
            setVerificationId(vId);
            setStep('OTP');
        } catch (error: any) {
            console.error("Error in sending otp", error);
            alert(`Failed to send OTP: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !verificationId) return;
        setLoading(true);
        try {
            const success = await verifyOtp(verificationId, otp, phoneNumber);
            if (success) {
                // Force page reload to trigger auth check in App.tsx
                window.location.href = '/';
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error: any) {
            console.error("Error verifying OTP", error);
            alert(`Verification failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {step === 'PHONE' ? 'Enter your mobile number to continue.' : `Enter OTP sent to ${phoneNumber}`}
                </p>

                {step === 'PHONE' ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="tel"
                            placeholder="9876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                textAlign: 'center',
                                letterSpacing: '4px'
                            }}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('PHONE');
                                setOtp('');
                                setVerificationId(null);
                            }}
                            style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                        >
                            Change Number
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Login;
