const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (process.env.MONGO_URI === undefined) {
        console.error("FATAL: MONGO_URI is not defined.");
        throw new Error("MONGO_URI is missing from env variables");
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            // Buffer commands is safer for seeding bursts on cold starts
            bufferCommands: true,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("MongoDB Connection Error:", e);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
