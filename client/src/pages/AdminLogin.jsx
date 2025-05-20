import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        login,
        password
      });
      
      // Сохраняем токен
      localStorage.setItem('adminToken', response.data.token);
      
      // Перенаправляем в админ-панель
      navigate('/AdminPanel');
      
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        setError('Ошибка сервера');
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Вход для администратора</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Войти</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;