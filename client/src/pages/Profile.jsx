import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Header from '../components/Header';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
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

  const handleSubscribe = async () => {
    if (subscribing) return;
    setSubscribing(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/user/subscribe',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Обновляем данные пользователя в состоянии
      setUserData(prev => ({
        ...prev,
        subscription: response.data.subscription
      }));
    } catch (error) {
      console.error('Ошибка оформления подписки:', error);
      alert('Не удалось оформить подписку');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <>
      <Header />

      <div className="profile-container">
        <div className="profile-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Назад
          </button>

          <h2>Мой профиль</h2>

          {userData && (
            <>
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
                  <p>
                    <strong>Дата регистрации:</strong>{' '}
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Подписка:</strong>{' '}
                    {userData.subscription && userData.subscription.isActive ? (
                      <>Активна до {new Date(userData.subscription.endDate).toLocaleDateString()}</>
                    ) : (
                      'Не оформлена'
                    )}
                  </p>
                </div>
              </div>

              {!userData.subscription?.isActive && (
                <button
                  onClick={handleSubscribe}
                  className="subscribe-btn"
                  disabled={subscribing}
                >
                  {subscribing ? 'Оформление...' : 'Оформить подписку'}
                </button>
              )}
            </>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
