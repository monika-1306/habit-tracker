import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/BossStatus.module.css';


const BossStatus = () => {
  const [boss, setBoss] = useState(null);

  useEffect(() => {
    API.get('/bossteam').then(res => setBoss(res.data));
  }, []);

  if (!boss) return null;

  const hpPercent = (boss.currentHP / boss.maxHP) * 100;

  return (
    <div className={styles.bossContainer}>
  <h2>Boss: {boss.name}</h2>
  <div className={styles.hpBar}>
    <div className={styles.hpFill} style={{ width: `${hpPercent}%` }} />
  </div>
  <p>{boss.currentHP} / {boss.maxHP} HP</p>
</div>

  );
};

export default BossStatus;