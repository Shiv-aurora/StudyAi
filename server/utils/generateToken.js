const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    // Fallback secret for development/demo if env var is missing
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_demo_only';

    const token = jwt.sign({ userId }, secret, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always true for Vercel/HTTPS
        sameSite: 'None', // Needed for cross-origin/serverless
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

module.exports = generateToken;
