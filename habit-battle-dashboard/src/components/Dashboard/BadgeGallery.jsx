import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/BadgeGallery.module.css';


const BadgeGallery = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    API.get('/users/me').then(res => setBadges(res.data.badges));
  }, []);

  return (
    <div className={styles.gallery}>
        <h2>Your Badges</h2>
        <ul className={styles.badgeList}>
          {badges.map((badge, index) => (
            <li key={index} className={styles.badgeItem}>{badge}</li>
          ))}
        </ul>
    </div>

  );
};

export default BadgeGallery;