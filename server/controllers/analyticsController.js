const Task = require('../models/Task');
const Course = require('../models/Course');

// @desc    Get Analytics Data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).populate('course');

        // 1. Task Status Distribution (Pending vs Completed)
        const statusDistribution = [
            { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
            { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length },
        ];

        // 2. Study Hours per Course
        const courseHoursMap = {};
        tasks.forEach(task => {
            const courseName = task.course ? task.course.name : 'General';
            if (!courseHoursMap[courseName]) courseHoursMap[courseName] = 0;
            courseHoursMap[courseName] += task.estimated_hours;
        });

        const courseDistribution = Object.keys(courseHoursMap).map(name => ({
            name,
            value: courseHoursMap[name],
        }));

        // 3. Difficulty Distribution
        const difficultyMap = {};
        tasks.forEach(task => {
            const diff = `Level ${task.difficulty}`;
            if (!difficultyMap[diff]) difficultyMap[diff] = 0;
            difficultyMap[diff]++;
        });
        const difficultyDistribution = Object.keys(difficultyMap).map(name => ({
            name,
            value: difficultyMap[name]
        }))

        res.json({
            statusDistribution,
            courseDistribution,
            difficultyDistribution
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating analytics' });
    }
};

module.exports = { getAnalytics };
