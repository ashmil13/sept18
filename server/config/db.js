const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('No MONGO_URI specified in .env. Using local JSON files for storage.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
    return true;
  } catch (err) {
    console.warn('MongoDB connection failed. Falling back to local JSON files. Error:', err.message);
    return false;
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isConnected
};
