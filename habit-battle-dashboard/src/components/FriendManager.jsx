import React, { useEffect, useState } from 'react';
import API from '../api';
import styles from './FriendManager.module.css';
import { jwtDecode } from 'jwt-decode';

const FriendManager = () => {
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;
        const res = await API.get('/friends/list', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const accepted = [];
        const pending = [];

        res.data.forEach(f => {
          const isRequester = f.requester._id === userId;
          const friend = isRequester ? f.recipient : f.requester;

          if (f.status === 'accepted') {
            accepted.push(friend);
          } else if (!isRequester && f.status === 'pending') {
            pending.push({ ...f, from: f.requester });
          }
        });

        setFriends(accepted);
        setRequests(pending);
      } catch (err) {
        console.error('Friend fetch error:', err.response?.data || err.message);
      }
    };

    fetchFriends();
  }, []);

  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/friends/request', { recipientEmail: email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Friend request sent!');
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error sending request');
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/friends/accept', { requesterId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(prev => prev.filter(r => r.from._id !== requesterId));
      setMessage('🎉 Friend request accepted!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error accepting request');
    }
  };

  return (
    <div className={styles.friendManager}>
      <h3 className={styles.title}>🧑‍🤝‍🧑 Find Friends</h3>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter friend's email"
        className={styles.input}
      />
      <button onClick={handleSendRequest} className={styles.button}>
        Send Request
      </button>
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.section}>
        <h4>📨 Incoming Requests</h4>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <ul>
            {requests.map(r => (
              <li key={r._id}>
                {r.from.name} ({r.from.email})
                <button onClick={() => handleAccept(r.from._id)} className={styles.acceptButton}>
                  Accept
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.section}>
        <h4>🛡️ Your Friends</h4>
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          <ul>
            {friends.map(f => (
              <li key={f._id}>
                {f.name} ({f.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendManager;