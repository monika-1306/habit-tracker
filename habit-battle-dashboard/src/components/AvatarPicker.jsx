import React from 'react';

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png'
];

const AvatarPicker = ({ onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
      {avatarOptions.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`avatar-${index}`}
          onClick={() => onSelect(url)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: '2px solid transparent',
            transition: '0.2s ease-in-out'
          }}
          onMouseOver={e => (e.currentTarget.style.border = '2px solid #2196f3')}
          onMouseOut={e => (e.currentTarget.style.border = '2px solid transparent')}
        />
      ))}
    </div>
  );
};

export default AvatarPicker;