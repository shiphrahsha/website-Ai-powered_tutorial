// src/components/AuthForm.js
import React, { useState, useEffect } from 'react';
import Preloader from '../Dashboard/PreLoader';
import '../pages/AuthForm.css';


const AuthForm = ({ navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    usernameOrEmail: ''
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', usernameOrEmail: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://127.0.0.1:5000/login' : 'http://127.0.0.1:5000/register';
    const body = isLogin
      ? { identifier: formData.usernameOrEmail, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (response.ok) {
        if (isLogin) {
          console.log('Login successful:', result);
          // Save JWT token in localStorage
          const token = result.token;
          localStorage.setItem('access_token', token);
          console.log('Stored Token:', token); // Should show the token
          navigate('dashboard');
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-container">
      {loading ? (
        <Preloader />
      ) : (
        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            {isLogin ? (
              <div className="form-group">
                <label>Username or Email</label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : null}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="submit-button" type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
            <div className="toggle-link">
              {isLogin ? (
                <button type="button" onClick={toggleForm} className="link-button">
                  New user? Create an account
                </button>
              ) : (
                <button type="button" onClick={toggleForm} className="link-button">
                  Already a user? Log in
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthForm;



