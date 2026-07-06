import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import '../styles/login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields to continue.');
      return;
    }
    setLoading(true);
    sessionStorage.setItem('just_logged_in', 'true');
    setTimeout(() => navigate('/workspace'), 600);
  };

  const handleDemo = () => {
    setLoading(true);
    sessionStorage.setItem('just_logged_in', 'true');
    setTimeout(() => navigate('/workspace'), 600);
  };

  return (
    <div className="pro-login-container">
      <img 
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
        alt="Luxury Real Estate" 
        className="pro-login-bg-image"
      />
      <div className="pro-login-bg-overlay"></div>

      <div className="pro-login-content">
        <div className="pro-login-card">
          <div className="pro-login-logo">
            <div className="pro-login-logo-icon">
              <Building2 size={22} color="white" strokeWidth={2.5} />
            </div>
            <span className="pro-login-logo-text">PropAgentOS Exclusive</span>
          </div>

          <h1 className="pro-login-title">Welcome Back</h1>
          <p className="pro-login-subtitle">Access your premium real estate portfolio and discover new opportunities.</p>

          {error && (
            <div className="pro-error">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form className="pro-login-form" onSubmit={handleLogin}>
            <div className="pro-input-group">
              <label className="pro-input-label" htmlFor="login-email">Email Address</label>
              <div className="pro-input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  className="pro-input"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pro-input-group">
              <label className="pro-input-label" htmlFor="login-password">Password</label>
              <div className="pro-input-wrapper">
                <input
                  id="login-password"
                  type="password"
                  className="pro-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="pro-btn-primary"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pro-divider">or</div>

          <button
            id="login-demo"
            type="button"
            className="pro-btn-secondary"
            onClick={handleDemo}
            disabled={loading}
          >
            <Shield size={18} strokeWidth={2} />
            Continue as Guest
            <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
          </button>

          <p className="pro-footer-text">
            PropAgentOS Exclusive · Luxury Edition © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
