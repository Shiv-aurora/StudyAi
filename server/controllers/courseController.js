const Course = require('../models/Course');
const Task = require('../models/Task');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    const courses = await Course.find({ user: req.user._id });
    res.json(courses);
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
    const { name, instructor, color } = req.body;

    if (!name) {
        res.status(400).json({ message: 'Please add a course name' });
        return;
    }

    const course = await Course.create({
        user: req.user._id,
        name,
        instructor,
        color,
    });

    res.status(201).json(course);
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the course user
    if (course.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedCourse);
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
    }

    if (course.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    // Also remove tasks associated with this course?
    // Optionally: await Task.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({ id: req.params.id });
};

module.exports = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
};
