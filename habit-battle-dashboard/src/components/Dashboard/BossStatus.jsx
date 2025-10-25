import { useEffect, useState } from 'react';
import API from '../../api';
import styles from '../../styles/BossStatus.module.css';

const BossStatus = () => {
  const [boss, setBoss] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoss = async () => {
      try {
        const res = await API.get('/boss'); // ✅ Corrected endpoint
        setBoss(res.data);
      } catch (err) {
        setError('Failed to load boss status');
      } finally {
        setLoading(false);
      }
    };
    fetchBoss();
  }, []);

  if (loading) return <p className={styles.loading}>Loading boss...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!boss) return null;

  const hpPercent = (boss.currentHP / boss.maxHP) * 100;

  return (
    <div className={styles.bossContainer}>
      <h2 className={styles.title}>👹 Boss: {boss.name}</h2>
      <div className={styles.hpBar}>
        <div className={styles.hpFill} style={{ width: `${hpPercent}%` }} />
      </div>
      <p className={styles.hpText}>{boss.currentHP} / {boss.maxHP} HP</p>
    </div>
  );
};

export default BossStatus;