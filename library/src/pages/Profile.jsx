import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar: '',
    subscription: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Замените URL на ваш эндпоинт API
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubscribe = async () => {
    try {
      setSubscriptionLoading(true);
      // API запрос для подписки
      const response = await axios.post('/api/user/subscribe', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserData(prev => ({ ...prev, subscription: true }));
      alert('Подписка успешно оформлена!');
    } catch (err) {
      console.error('Ошибка оформления подписки:', err);
      alert('Не удалось оформить подписку');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // API запрос для обновления данных
      await axios.put('/api/user/profile', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setIsEditing(false);
      alert('Данные успешно сохранены!');
    } catch (err) {
      console.error('Ошибка сохранения профиля:', err);
      alert('Не удалось сохранить изменения');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !isEditing) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-page">
      <h1>Мой профиль</h1>
      
      <div className="profile-header">
        <div className="avatar-container">
          <img 
            src={userData.avatar || '/default-avatar.png'} 
            alt="Аватар" 
            className="profile-avatar"
          />
          {isEditing && (
            <div className="avatar-upload">
              <label htmlFor="avatar-upload" className="upload-btn">
                Изменить фото
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
        
        <div className="user-status">
          <span className={`subscription-badge ${userData.subscription ? 'active' : ''}`}>
            {userData.subscription ? 'Премиум подписка' : 'Бесплатная версия'}
          </span>
          <p className="member-since">Участник с: 12.05.2023</p>
        </div>
      </div>
      
      <div className="user-info">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label>Имя</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Введите ваш email"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="Введите ваш телефон"
                />
              </div>
              
              <div className="form-group">
                <label>Город</label>
                <input
                  type="text"
                  name="location"
                  value={userData.location}
                  onChange={handleInputChange}
                  placeholder="Введите ваш город"
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>О себе</label>
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                placeholder="Расскажите о себе"
                rows="4"
              />
            </div>
          </div>
        ) : (
          <div className="info-display">
            <div className="info-item">
              <span className="info-label">Имя:</span>
              <span className="info-value">{userData.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Телефон:</span>
              <span className="info-value">{userData.phone || 'Не указан'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Город:</span>
              <span className="info-value">{userData.location || 'Не указан'}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">О себе:</span>
              <span className="info-value">{userData.bio || 'Не указано'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)} disabled={loading}>
              Отмена
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Редактировать профиль
            </button>
            {!userData.subscription && (
              <button 
                className="subscribe-btn" 
                onClick={handleSubscribe}
                disabled={subscriptionLoading}
              >
                {subscriptionLoading ? 'Обработка...' : 'Оформить подписку'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;