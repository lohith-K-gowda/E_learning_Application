const express = require('express');
const authenticate = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const {
  getCourses,
  getAvailableCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} = require('../controllers/courseController');

const router = express.Router();
router.get('/', authenticate, getCourses);
router.get('/available', authenticate, getAvailableCourses);
router.get('/:id', authenticate, getCourseById);
router.post('/', authenticate, allowRoles('admin', 'instructor'), createCourse);
router.put('/:id', authenticate, allowRoles('admin', 'instructor'), updateCourse);
router.delete('/:id', authenticate, allowRoles('admin'), deleteCourse);
router.post('/:id/enroll', authenticate, allowRoles('student'), enrollCourse);

module.exports = router;
