import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Index from "./Index";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

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
        flexDirection: 'column'
      }}>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '450px',
                padding: '30px',
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

              {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
              {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#0d6efd',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Login;
