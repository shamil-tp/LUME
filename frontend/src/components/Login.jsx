import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import api from '../services/api'

const Login = ({ onLogin }) => {
    // This handles the Google OAuth response
    const handleGoogleSuccess = async (credentialResponse) => {
        // console.log("Success! Google JWT Token:", credentialResponse.credential);
        try{
            const result = await api.post('/login',{
            credentials:credentialResponse.credential
            })
            console.log(result.data)
            
            if (onLogin) onLogin();
        }catch(e){
            console.log("Backend Login Failed:", e.response?.data || e.message)
        }
        
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="login-logo">
                        <svg height="40" viewBox="0 0 24 24" width="40" fill="#ff0044">
                            <path d="M21.582 6.186a2.506 2.506 0 0 0-1.762-1.766C18.265 4 12 4 12 4s-6.264 0-7.82.42a2.506 2.506 0 0 0-1.762 1.766C2 7.74 2 12 2 12s0 4.26.418 5.814a2.506 2.506 0 0 0 1.762 1.766C5.735 20 12 20 12 20s6.265 0 7.82-.42a2.506 2.506 0 0 0 1.762-1.766C22 16.26 22 12 22 12s0-4.26-.418-5.814zM9.993 15.595V8.405l6.362 3.593-6.362 3.597z" />
                        </svg>
                        <span className="logo-text">LUME</span>
                    </div>
                </div>

                <div className="login-content">
                    <h1>Welcome back</h1>
                    <p>Sign in securely to continue</p>

                    <div className="oauth-container">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Google Login Failed')}
                            theme="filled_black"
                            size="large"
                            shape="rectangular"
                            text="continue_with"
                            width="100%"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;