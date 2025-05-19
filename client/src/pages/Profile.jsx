import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        localStorage.removeItem('token');
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Мой профиль</h2>
        
        {userData && (
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src={userData.avatar || '/default-avatar.png'} 
                alt="Аватар" 
              />
            </div>
            
            <div className="profile-details">
              <p><strong>Имя:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Дата регистрации:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;