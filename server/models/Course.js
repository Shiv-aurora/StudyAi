const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: { type: String, required: true },
    instructor: { type: String },
    color: { type: String, default: '#3B82F6' },
    schedule: { type: String },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
