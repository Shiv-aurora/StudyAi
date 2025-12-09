const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Course = require('../models/Course');
const Task = require('../models/Task');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'Please fill in all fields' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters' });
        return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'Email already registered' });
        return;
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(400).json({ message: 'Username already taken' });
        return;
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Login as Guest (Demo)
// @route   POST /api/users/guest
// @access  Public
const guestLogin = async (req, res) => {
    const guestId = Math.random().toString(36).substring(7);
    const username = `Guest_${guestId}`;
    const email = `guest_${guestId}@example.com`;
    const password = 'guestpassword';

    try {
        // 1. Create User (Essential)
        const user = await User.create({
            username,
            email,
            password
        });

        // 2. Generate Token Immediately (So login succeeds even if seeding fails)
        generateToken(res, user._id);

        // 3. Seed Data (Reverting to simpler Promise.all pattern for reliability)
        try {
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
            const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

            // Create Courses in Parallel
            const [webDev, dataSci, history, psych, calc] = await Promise.all([
                Course.create({ user: user._id, name: 'Web Development', color: '#D97706', instructor: 'Prof. Smith', schedule: 'Mon,Wed 10:00-11:30' }),
                Course.create({ user: user._id, name: 'Data Science', color: '#059669', instructor: 'Dr. Turing', schedule: 'Tue,Thu 14:00-15:30' }),
                Course.create({ user: user._id, name: 'Modern History', color: '#B45309', instructor: 'Prof. Alpert', schedule: 'Fri 09:00-12:00' }),
                Course.create({ user: user._id, name: 'Cognitive Psych', color: '#7C2D12', instructor: 'Dr. Ray', schedule: 'Mon,Wed 13:00-14:30' }),
                Course.create({ user: user._id, name: 'Calculus II', color: '#0F766E', instructor: 'Prof. Newton', schedule: 'Tue,Thu 09:00-10:30' })
            ]);

            // Create Tasks in Parallel
            await Promise.all([
                Task.create({ user: user._id, course: webDev._id, title: 'React Project', description: 'Build a dashboard', deadline: nextWeek, difficulty: 4, estimated_hours: 5, status: 'pending' }),
                Task.create({ user: user._id, course: webDev._id, title: 'CSS Flexbox Quiz', description: 'Review layout module', deadline: tomorrow, difficulty: 2, estimated_hours: 1, status: 'pending' }),
                Task.create({ user: user._id, course: dataSci._id, title: 'Python Analysis', description: 'Analyze dataset', deadline: tomorrow, difficulty: 3, estimated_hours: 3, status: 'pending' }),
                Task.create({ user: user._id, course: history._id, title: 'Essay Draft', description: 'WWII Causes', deadline: nextWeek, difficulty: 4, estimated_hours: 4, status: 'pending' }),
                Task.create({ user: user._id, course: psych._id, title: 'Reading Ch 4', description: 'Memory models', deadline: today, difficulty: 1, estimated_hours: 2, status: 'completed' }),
                Task.create({ user: user._id, course: calc._id, title: 'Problem Set 3', description: 'Integration by parts', deadline: nextWeek, difficulty: 5, estimated_hours: 6, status: 'pending' }),
                Task.create({ user: user._id, course: dataSci._id, title: 'Midterm Review', description: 'Study guide', deadline: nextWeek, difficulty: 5, estimated_hours: 8, status: 'pending' })
            ]);

        } catch (seedError) {
            console.error("Seeding failed:", seedError);
            // We do NOT return error effectively, allowing login to succeed, 
            // but we log it. In production logs we'd see this.
        }

        // Return Success
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isGuest: true
        });

    } catch (error) {
        console.error("CRITICAL GUEST LOGIN ERROR:", error);
        res.status(500).json({
            message: "Guest login failed",
            error: error.message
        });
    }
}

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    authUser,
    logoutUser,
    guestLogin,
};
