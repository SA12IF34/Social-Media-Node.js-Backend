const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async (uri=undefined) => {
    try {
        await mongoose.connect(uri || process.env.MONGODB_URI);
    } catch (error) {
        console.log('Error!')
        console.error(error)
    }
}



const disconnectTestDB = async (mongod) => {
    await mongoose.disconnect();
    await mongod.stop();
}

module.exports = {
    connectDB,
    disconnectTestDB
}; 