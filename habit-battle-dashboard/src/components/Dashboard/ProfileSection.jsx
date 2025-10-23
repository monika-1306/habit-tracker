// components/Dashboard/ProfileSection.jsx
import AvatarUpload from './AvatarUpload';

const ProfileSection = ({ user }) => (
  <div>
    <h2>{user.username}</h2>
    <AvatarUpload />
    <p>XP: {user.xp} | Level: {user.level}</p>
  </div>
);

export default ProfileSection;