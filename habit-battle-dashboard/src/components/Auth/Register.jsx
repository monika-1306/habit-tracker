import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import styles from '../../styles/Register.module.css';

const avatarOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png'
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAvatarSelect = url => setForm(prev => ({ ...prev, avatar: url }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>🛡️ Create Your Hero Profile</h2>

      <input name="name" onChange={handleChange} placeholder="Name" className={styles.input} required />
      <input name="email" onChange={handleChange} placeholder="Email" className={styles.input} required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" className={styles.input} required />

      <h3 className={styles.subtitle}>Choose Your Avatar</h3>
      <div className={styles.avatarGrid}>
        {avatarOptions.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`avatar-${index}`}
            onClick={() => handleAvatarSelect(url)}
            className={`${styles.avatar} ${form.avatar === url ? styles.selected : ''}`}
          />
        ))}
      </div>

      <button type="submit" className={styles.button}>Join the Guild</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default Register;