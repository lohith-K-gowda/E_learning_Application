const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Course = require('./models/Course');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'https://e-learning-application-tsf8.vercel.app' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Ellipsonic API is running' }));

const sampleCourses = [
  {
    title: 'Introduction to JavaScript',
    description: 'Learn the fundamentals of JavaScript and build dynamic web pages.',
    instructor: 'Alice Johnson',
  },
  {
    title: 'Responsive Web Design',
    description: 'Build responsive layouts using HTML, CSS, and modern design principles.',
    instructor: 'Marcus Lee',
  },
  {
    title: 'React for Beginners',
    description: 'Create powerful React applications from scratch, including state and hooks.',
    instructor: 'Priya Patel',
  },
];

const seedCourses = async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(sampleCourses);
      console.log('Seeded sample courses');
    }
  } catch (error) {
    console.error('Course seeding failed:', error.message);
  }
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => seedCourses())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start backend:', error.message);
  });
