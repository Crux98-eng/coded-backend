const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const coursesRoutes = require('./routes/courses');
const modulesRoutes = require('./routes/modules');
const lessonsRoutes = require('./routes/lessons');
const materialsRoutes = require('./routes/materials');
dotenv.config();

//console.log('GOOGLE_APP_PASSWORD loaded:', process.env.GOOGLE_APP_PASSWORD ? 'Yes' : 'No');

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
app.use('/users', userRoutes);
app.use('/courses', coursesRoutes);
app.use('/modules', modulesRoutes);
app.use('/lessons', lessonsRoutes);
app.use('/materials', materialsRoutes);

app.get('/', (req, res) => {
  res.send('Backend for Coded Mind - REGISTER -> APPROVE -> LOGIN flow');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});