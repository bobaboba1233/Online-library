import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: formData.email,
      password: formData.password
    });
    localStorage.setItem('token', response.data.token);
    navigate('/profile'); // Редирект на профиль после входа
  } catch (err) {
    setError(err.response?.data?.message || 'Ошибка входа');
  }
};

  return (
    <div className="auth-form">
      <h2>Вход</h2>
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="auth-button">
          Войти
        </button>
      </form>
      
      <p className="auth-switch-text">
        Нет аккаунта?{' '}
        <span className="auth-switch-link" onClick={onSwitch}>
          Зарегистрироваться
        </span>
      </p>
    </div>
  );
};

export default LoginForm;