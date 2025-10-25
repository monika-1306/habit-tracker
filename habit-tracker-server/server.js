const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ✅ Serve uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ CORS setup for frontend communication
const allowedOrigins = [
  'http://localhost:3000',
  'https://habit-tracker-hazel-omega.vercel.app', // your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Base route
app.get('/', (req, res) => res.send('API is running...'));

// ✅ Modular routes
const userRoutes = require('./routes/userRoutes');
const habitRoutes = require('./routes/habitRoutes');
const bossRoutes = require('./routes/bossRoutes');
const friendRoutes = require('./routes/friendRoutes');

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/boss', bossRoutes);
app.use('/api/friends', friendRoutes);

// ✅ Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: 'Server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Graceful shutdown
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err.message);
  process.exit(1);
});