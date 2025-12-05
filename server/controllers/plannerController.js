const Task = require('../models/Task');
const generateSchedule = require('../utils/aiPlanner');

// @desc    Generate AI Study Schedule
// @route   POST /api/planner/generate
// @access  Private
const getSchedule = async (req, res) => {
    const { dailyHours } = req.body; // User can specify limit
    const limit = dailyHours || 4;

    const tasks = await Task.find({ user: req.user._id });

    const schedule = generateSchedule(tasks, limit);

    res.json(schedule);
};

module.exports = { getSchedule };
