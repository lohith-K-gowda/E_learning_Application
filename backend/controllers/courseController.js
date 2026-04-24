const Course = require('../models/Course');
const User = require('../models/User');

exports.getCourses = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const courses = await Course.find({ _id: { $in: req.user.enrolledCourses } });
      return res.json(courses);
    }
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load courses', error: error.message });
  }
};

exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    const enrolledSet = new Set(req.user.enrolledCourses.map((id) => id.toString()));
    const annotated = courses.map((course) => ({
      ...course.toObject(),
      enrolled: enrolledSet.has(course._id.toString()),
    }));
    res.json(annotated);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load available courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load course', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor } = req.body;
    const course = await Course.create({ title, description, instructor });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create course', error: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { title, description, instructor } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, instructor },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update course', error: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete course', error: error.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const user = await User.findById(req.user._id);

    if (user.enrolledCourses.some((id) => id.equals(course._id))) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    user.enrolledCourses.push(course._id);
    course.students.push(user._id);
    await user.save();
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed', error: error.message });
  }
};
