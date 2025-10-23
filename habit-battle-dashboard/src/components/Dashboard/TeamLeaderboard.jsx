import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/TeamLeaderboard.module.css';


const TeamLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    API.get('/bossteam/leaderboard').then(res => setLeaders(res.data));
  }, []);

  return (
    <div className={styles.leaderboard}>
      <h2>Team Leaderboard</h2>
      <ol className={styles.list}>
        {leaders.map((member, index) => (
          <li key={index} className={styles.item}>
            {member.username} – {member.totalDamage} dmg
          </li>
        ))}
      </ol>
    </div>

  );
};

export default TeamLeaderboard;