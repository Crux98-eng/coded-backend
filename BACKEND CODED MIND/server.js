const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

console.log('GOOGLE_APP_PASSWORD loaded:', process.env.GOOGLE_APP_PASSWORD ? 'Yes' : 'No');

const app = express();
const port = process.env.PORT ;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend for Coded Mind - REGISTER -> APPROVE -> LOGIN flow');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});