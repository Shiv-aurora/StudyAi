const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if already connected (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
