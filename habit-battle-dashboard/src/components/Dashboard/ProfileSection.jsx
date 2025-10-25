// components/Dashboard/ProfileSection.jsx
import AvatarUpload from './AvatarUpload';
import styles from './ProfileSection.module.css';

const ProfileSection = ({ user }) => {
  if (!user) return null;

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.username}>🧙 {user.username}</h2>

      <AvatarUpload />

      <p className={styles.stats}>
        XP: <span className={styles.xp}>{user.xp}</span> | Level: <span className={styles.level}>{user.level}</span>
      </p>
    </div>
  );
};

export default ProfileSection;