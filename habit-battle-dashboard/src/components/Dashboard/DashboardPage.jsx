import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API from '../../api';
import styles from './DashboardPage.module.css';
import FriendManager from '../FriendManager';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [levelUp, setLevelUp] = useState(false);
  const [selectedHabitDates, setSelectedHabitDates] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Redirect immediately if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Helper function to log errors clearly
  const logError = (context, err) => {
    const msg = err.response?.data?.error || err.response?.data || err.message;
    console.error(`${context} error:`, msg);
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        logError('Profile fetch', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    if (token) fetchProfile();
  }, [token, navigate]);

  // Fetch habits
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await API.get('/habits', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHabits(res.data);

        const allDates = res.data.flatMap(habit =>
          habit.completedDates?.map(date => new Date(date).toDateString()) || []
        );
        setSelectedHabitDates(allDates);
      } catch (err) {
        logError('Habit fetch', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    if (token) fetchHabits();
  }, [token, navigate]);

  // Create new habit
  const handleCreateHabit = async () => {
    if (!title || !category) return alert('Please enter habit name and category.');
    try {
      const res = await API.post('/habits', { title, category }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabits(prev => [...prev, res.data]);
      setTitle('');
      setCategory('');
    } catch (err) {
      logError('Create habit', err);
    }
  };

  // Complete habit
  const handleCompleteHabit = async (habitId) => {
    try {
      const res = await API.post(`/habits/${habitId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const previousLevel = user.level;

      setUser(prev => ({
        ...prev,
        level: res.data.level,
        xp: res.data.xp,
        badges: res.data.badges,
        gear: res.data.gear
      }));

      if (res.data.level > previousLevel) {
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 3000);
      }

      setHabits(prev =>
        prev.map(h =>
          h._id === habitId
            ? { ...h, streak: res.data.streak, lastCompleted: res.data.lastCompleted }
            : h
        )
      );

      setSelectedHabitDates(prev => [...prev, new Date().toDateString()]);
    } catch (err) {
      logError('Complete habit', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const xpPercent = user ? user.xp : 0;

  if (!user) return <p className={styles.loading}>Summoning your dashboard...</p>;

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heading}>Welcome, {user.name}</h2>

      <img
        src={user.avatar || '/avatars/default.png'}
        alt="avatar"
        className={styles.avatar}
      />

      {user.gear?.includes('helmet') && (
        <img src="/gear/helmet.png" alt="Helmet" className={styles.gear} />
      )}

      <p className={`${styles.stat} ${levelUp ? styles.levelUpGlow : ''}`}>
        Level: {user.level}
      </p>
      <p className={styles.stat}>XP: {user.xp}</p>

      <p className={styles.stat}>XP Progress:</p>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${xpPercent}%` }}></div>
      </div>

      <div className={styles.calendarSection}>
        <h4>📅 Habit Completion Calendar</h4>
        <Calendar
          tileClassName={({ date }) =>
            selectedHabitDates.includes(date.toDateString()) ? styles.marked : null
          }
        />
      </div>

      <div className={styles.badgeSection}>
        <h4>🎖️ Your Badges</h4>
        <ul>
          {user.badges?.length > 0 ? (
            user.badges.map((badge, index) => (
              <li key={index} className={styles.badge}>{badge}</li>
            ))
          ) : (
            <li className={styles.badge}>No badges earned yet</li>
          )}
        </ul>
      </div>

      <div className={styles.habitForm}>
        <h3>Create a New Habit</h3>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter habit name"
          className={styles.habitInput}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Category</option>
          <option value="Health">Health</option>
          <option value="Learning">Learning</option>
          <option value="Creativity">Creativity</option>
        </select>
        <button onClick={handleCreateHabit} className={styles.habitButton}>
          Add Habit
        </button>
      </div>

      <div className={styles.habitList}>
        <h4>Your Habits</h4>
        <ul>
          {habits.map(habit => (
            <li key={habit._id}>
              {habit.title} — Streak: {habit.streak || 0}
              <button
                onClick={() => handleCompleteHabit(habit._id)}
                className={styles.completeButton}
              >
                Complete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <FriendManager />

      <button onClick={handleLogout} className={styles.logoutButton}>
        Log Out
      </button>
    </div>
  );
};

export default DashboardPage;
