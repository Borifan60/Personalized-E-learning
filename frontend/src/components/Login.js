import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Index from "./Index";
import Footer from './Footer';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Handle Remember Me functionality
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email.trim());
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/userInfo/login',
        {
          email: email.trim(),
          password
        },
        {
          withCredentials: true
        }
      );

      const { message, firstname, role } = response.data;

      setSuccess(message);

      localStorage.setItem('role', role);
      localStorage.setItem('firstname', firstname);

      setTimeout(() => {
        switch (role.toLowerCase()) {
          case 'admin': navigate('/admin'); break;
          case 'teacher': navigate('/teacher'); break;
          case 'student': navigate('/student'); break;
          default: navigate('/'); break;
        }
      }, 800);

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Index />

      {/* PAGE WRAPPER */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Segoe UI, Roboto, sans-serif'
      }}>

        {/* MAIN CONTENT */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '800px', // INCREASED WIDTH (was 600px)
            padding: '30px', // REDUCED PADDING (was 50px)
            background: 'linear-gradient(145deg, #ffffff, #f5f7fa)',
            borderRadius: '14px', // REDUCED RADIUS (was 16px)
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }} />
            
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '25px' // REDUCED MARGIN (was 40px)
            }}>
              <h2 style={{
                margin: '0 0 8px 0', // REDUCED MARGIN (was 12px)
                fontSize: '26px', // REDUCED FONT SIZE (was 32px)
                fontWeight: '600',
                color: '#2d3748',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Welcome Back
              </h2>
              <p style={{ 
                color: '#718096', 
                fontSize: '14px', // REDUCED FONT SIZE (was 16px)
                margin: 0 
              }}>
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: '12px', // REDUCED PADDING (was 16px)
                  backgroundColor: '#fed7d7',
                  color: '#9b2c2c',
                  borderRadius: '8px', // REDUCED RADIUS (was 10px)
                  marginBottom: '18px', // REDUCED MARGIN (was 24px)
                  fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div style={{
                  padding: '12px', // REDUCED PADDING (was 16px)
                  backgroundColor: '#c6f6d5',
                  color: '#276749',
                  borderRadius: '8px', // REDUCED RADIUS (was 10px)
                  marginBottom: '18px', // REDUCED MARGIN (was 24px)
                  fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '16px' }}>✅</span>
                  <span>{success}</span>
                </div>
              )}

              <div style={{ marginBottom: '18px' }}> {/* REDUCED MARGIN (was 24px) */}
                <label style={{
                  display: 'block',
                  marginBottom: '6px', // REDUCED MARGIN (was 8px)
                  fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                  fontWeight: '500',
                  color: '#4a5568'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px', // REDUCED PADDING (was 16px)
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px', // REDUCED RADIUS (was 12px)
                    fontSize: '15px', // REDUCED FONT SIZE (was 16px)
                    transition: 'all 0.2s',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}> {/* REDUCED MARGIN (was 28px) */}
                <label style={{
                  display: 'block',
                  marginBottom: '6px', // REDUCED MARGIN (was 8px)
                  fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                  fontWeight: '500',
                  color: '#4a5568'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px', // REDUCED PADDING (was 16px)
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px', // REDUCED RADIUS (was 12px)
                    fontSize: '15px', // REDUCED FONT SIZE (was 16px)
                    transition: 'all 0.2s',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px' // REDUCED MARGIN (was 32px)
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                  color: '#4a5568'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      marginRight: '8px', // REDUCED MARGIN (was 10px)
                      width: '16px', // REDUCED SIZE (was 18px)
                      height: '16px', // REDUCED SIZE (was 18px)
                      cursor: 'pointer'
                    }}
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px', // REDUCED PADDING (was 18px)
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px', // REDUCED RADIUS (was 12px)
                  fontSize: '15px', // REDUCED FONT SIZE (was 17px)
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 7px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="spinner" style={{
                      width: '16px', // REDUCED SIZE (was 18px)
                      height: '16px', // REDUCED SIZE (was 18px)
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Logging in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>

              <div style={{
                textAlign: 'center',
                marginTop: '25px', // REDUCED MARGIN (was 32px)
                paddingTop: '20px', // REDUCED PADDING (was 24px)
                borderTop: '1px solid #e2e8f0',
                fontSize: '14px', // REDUCED FONT SIZE (was 15px)
                color: '#718096'
              }}>
                <Link 
                  to="/forgot-password" 
                  style={{
                    color: '#667eea',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontSize: '14px' // REDUCED FONT SIZE (was 15px)
                  }}
                  onMouseOver={(e) => e.target.style.color = '#764ba2'}
                  onMouseOut={(e) => e.target.style.color = '#667eea'}
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
      </div>
    </>
  );
};

export default Login;