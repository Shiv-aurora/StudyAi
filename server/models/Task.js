const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false, // Can be a general task? Or required? Plan said ref Course. Let's make it optional for now or required if user insists. Implementation plan said "ref Course". Let's assume required to organize better.
        // Actually, allowing general tasks is flexible. Let's keep optional but encourage it.
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
        required: true,
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
    },
    estimated_hours: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
