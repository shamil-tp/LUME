import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate simple login bypass for now. 
        // In a real app, you'd validate and fetch auth tokens.
        if (email && password) {
            onLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="login-logo">
                        <svg height="32" viewBox="0 0 24 24" width="32" fill="red">
                            <path d="M21.582 6.186a2.506 2.506 0 0 0-1.762-1.766C18.265 4 12 4 12 4s-6.264 0-7.82.42a2.506 2.506 0 0 0-1.762 1.766C2 7.74 2 12 2 12s0 4.26.418 5.814a2.506 2.506 0 0 0 1.762 1.766C5.735 20 12 20 12 20s6.265 0 7.82-.42a2.506 2.506 0 0 0 1.762-1.766C22 16.26 22 12 22 12s0-4.26-.418-5.814zM9.993 15.595V8.405l6.362 3.593-6.362 3.597z" />
                        </svg>
                        <span className="logo-text">LUME</span>
                    </div>
                    <h2>Sign in</h2>
                    <p>to continue to LUME</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email" className={email ? 'active' : ''}>Email or phone</label>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password" className={password ? 'active' : ''}>Password</label>
                    </div>

                    <div className="login-links">
                        <a href="#" className="yt-link">Forgot password?</a>
                    </div>

                    <div className="login-actions">
                        <a href="#" className="yt-link">Create account</a>
                        <button type="submit" className="login-btn">Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
