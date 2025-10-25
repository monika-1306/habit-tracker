import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/BadgeGallery.module.css';

const BadgeGallery = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await API.get('/users/badges'); // ✅ Correct endpoint
        setBadges(res.data.badges);
      } catch (err) {
        setError('Failed to load badges');
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className={styles.gallery}>
      <h2 className={styles.title}>🏆 Your Badges</h2>

      {error && <p className={styles.error}>{error}</p>}

      {badges.length === 0 ? (
        <p className={styles.empty}>No badges earned yet. Start your quest!</p>
      ) : (
        <ul className={styles.badgeList}>
          {badges.map((badge, index) => (
            <li key={index} className={styles.badgeItem}>
              🏅 {badge}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BadgeGallery;