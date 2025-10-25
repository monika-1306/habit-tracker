import React, { useState } from 'react';
import styles from './AvatarPicker.module.css';

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png'
];

const AvatarPicker = ({ onSelect }) => {
  const [selected, setSelected] = useState('');

  const handleSelect = (url) => {
    setSelected(url);
    onSelect(url);
  };

  return (
    <div className={styles.grid}>
      {avatarOptions.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Avatar ${index + 1}`}
          onClick={() => handleSelect(url)}
          className={`${styles.avatar} ${selected === url ? styles.selected : ''}`}
        />
      ))}
    </div>
  );
};

export default AvatarPicker;