const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id }).populate('course');
    res.json(tasks);
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, deadline, difficulty, estimated_hours, course, status } = req.body;

    if (!title || !deadline || !estimated_hours) {
        res.status(400).json({ message: 'Please add title, deadline, and estimated hours' });
        return;
    }

    const task = await Task.create({
        user: req.user._id,
        title,
        description,
        deadline,
        difficulty,
        estimated_hours,
        course, // Optional
        status,
    });

    res.status(201).json(task);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    // Check user
    if (task.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    if (task.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await task.deleteOne();

    res.json({ id: req.params.id });
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
