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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    try {
      const res = await API.post('/users/login', { email, password });

      // Save JWT token to localStorage
      localStorage.setItem('token', res.data.token);

      console.log('Login successful:', res.data); // for debugging

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);

      // Show clear error message
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form} autoComplete="off">
      <h2 className={styles.title}>🎮 Login to Your Quest</h2>

      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={styles.input}
        autoComplete="off"
        required
      />

      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className={styles.input}
        autoComplete="off"
        required
      />

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Logging in...' : 'Enter the Arena'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.linkText}>
        Don't have an account?{' '}
        <Link to="/register" className={styles.link}>Register here</Link>
      </p>
    </form>
  );
};

export default Login;
