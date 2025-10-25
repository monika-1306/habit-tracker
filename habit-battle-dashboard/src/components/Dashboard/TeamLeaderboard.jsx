import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/TeamLeaderboard.module.css';

const TeamLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/bossteam/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p className={styles.loading}>Loading leaderboard...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.leaderboard}>
      <h2 className={styles.title}>🏆 Team Leaderboard</h2>
      <ol className={styles.list}>
        {leaders.map((member, index) => (
          <li
            key={index}
            className={`${styles.item} ${
              index === 0
                ? styles.gold
                : index === 1
                ? styles.silver
                : index === 2
                ? styles.bronze
                : ''
            }`}
          >
            {index + 1}. {member.username} – {member.totalDamage} dmg
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TeamLeaderboard;