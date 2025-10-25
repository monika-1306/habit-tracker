import { useState } from 'react';
import API from '../../api';
import styles from '../../styles/HabitItem.module.css';

const HabitItem = ({ habit, onComplete }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(`/habits/${habit._id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCompleted(true);
      onComplete?.(res.data); // optional callback to update parent state
    } catch (err) {
      console.error('Error completing habit:', err.response?.data || err.message);
    }
  };

  return (
    <div className={`${styles.card} ${completed ? styles.completed : ''}`}>
      <h3>{habit.title}</h3>
      <p>🔥 Streak: {habit.streak || 0}</p>
      <button className={styles.button} onClick={handleComplete} disabled={completed}>
        {completed ? 'Completed!' : 'Complete'}
      </button>
    </div>
  );
};

export default HabitItem;