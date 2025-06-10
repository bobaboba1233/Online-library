import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Header from '../components/Header';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const navigate = useNavigate();

  // Варианты подписок
  const subscriptionPlans = [
    {
      id: 'month',
      name: '1 месяц',
      price: '299 ₽',
      duration: 1,
      description: 'Доступ ко всем книгам на 1 месяц',
      popular: false
    },
    {
      id: '3months',
      name: '3 месяца',
      price: '799 ₽',
      duration: 3,
      description: 'Экономия 15% по сравнению с помесячной оплатой',
      popular: true
    },
    {
      id: 'year',
      name: '1 год',
      price: '2 999 ₽',
      duration: 12,
      description: 'Экономия 30% по сравнению с помесячной оплатой',
      popular: false
    }
  ];

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
    if (subscribing || !selectedPlan) return;
    setSubscribing(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/user/subscribe',
        { duration: selectedPlan.duration },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUserData(prev => ({
        ...prev,
        subscription: response.data.subscription
      }));
      setShowPlans(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Ошибка оформления подписки:', error);
      alert(error.response?.data?.message || 'Не удалось оформить подписку');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить подписку?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/user/unsubscribe',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUserData(prev => ({
        ...prev,
        subscription: { ...prev.subscription, isActive: false }
      }));
      alert('Подписка успешно отменена');
    } catch (error) {
      console.error('Ошибка отмены подписки:', error);
      alert(error.response?.data?.message || 'Не удалось отменить подписку');
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
                    {userData.subscription?.isActive ? (
                      <>
                        <span className="active-badge">Активна</span> до {new Date(userData.subscription.endDate).toLocaleDateString()}
                      </>
                    ) : (
                      <span className="inactive-badge">Не активна</span>
                    )}
                  </p>
                </div>
              </div>

              {userData.subscription?.isActive ? (
                <button
                  onClick={handleCancelSubscription}
                  className="cancel-subscription-btn"
                >
                  Отменить подписку
                </button>
              ) : (
                <>
                  {!showPlans ? (
                    <button
                      onClick={() => setShowPlans(true)}
                      className="subscribe-btn"
                    >
                      Оформить подписку
                    </button>
                  ) : (
                    <div className="subscription-plans">
                      <h3>Выберите тариф</h3>
                      <div className="plans-grid">
                        {subscriptionPlans.map(plan => (
                          <div 
                            key={plan.id}
                            className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                          >
                            {plan.popular && <div className="popular-badge">Выгодно</div>}
                            <h4>{plan.name}</h4>
                            <div className="plan-price">{plan.price}</div>
                            <p className="plan-description">{plan.description}</p>
                            {selectedPlan?.id === plan.id && (
                              <div className="selected-check">✓</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="plan-actions">
                        <button
                          onClick={() => {
                            setShowPlans(false);
                            setSelectedPlan(null);
                          }}
                          className="cancel-plan-btn"
                        >
                          Назад
                        </button>
                        <button
                          onClick={handleSubscribe}
                          className="confirm-subscribe-btn"
                          disabled={!selectedPlan || subscribing}
                        >
                          {subscribing ? 'Оформление...' : 'Подписаться'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
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