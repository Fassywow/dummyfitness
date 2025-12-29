import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const AskAI: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I'm your specific health assistant. Ask me anything about diet, fitness, or wellness!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const aiResponseText = await sendMessageToAI(userMsg.text);
        const aiMsg: ChatMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };

        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #eee', background: 'white' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={24} color="#4CAF50" /> Health AI
                </h2>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f9f9f9' }}>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            display: 'flex',
                            gap: '8px',
                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                        }}
                    >
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: msg.sender === 'user' ? '#2196F3' : '#4CAF50',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                        }}>
                            {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div style={{
                            padding: '12px',
                            borderRadius: '16px',
                            background: msg.sender === 'user' ? '#2196F3' : 'white',
                            color: msg.sender === 'user' ? 'white' : '#333',
                            boxShadow: msg.sender === 'ai' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                            borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
                        }}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', marginLeft: '40px', color: '#888', fontSize: '0.8rem' }}>
                        Typing...
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Ask about your diet..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '24px',
                        border: '1px solid #ddd',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'var(--primary-color)', color: 'white',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: (loading || !input.trim()) ? 'default' : 'pointer',
                        opacity: loading || !input.trim() ? 0.5 : 1
                    }}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default AskAI;
