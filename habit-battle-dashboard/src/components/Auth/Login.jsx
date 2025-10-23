import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api';
import styles from '../../styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h2 className={styles.title}>🎮 Login to Your Quest</h2>

      <input
        type="email"
        name="email"
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className={styles.input}
        required
      />

      <input
        type="password"
        name="password"
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className={styles.input}
        required
      />

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Logging in...' : 'Enter the Arena'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.linkText}>
        Don't have an account? <Link to="/register" className={styles.link}>Register here</Link>
      </p>
    </form>
  );
};

export default Login;