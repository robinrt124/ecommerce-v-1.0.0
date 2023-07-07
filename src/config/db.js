const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');

const connectDB = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        console.log('Database conecction successfully!');
        mongoose.connection.on('error', (error) => {
            console.error('DB Connection error: ', error);
        });
    } catch (err) {
        console.error('Could not connection to database: ', error.toString());
    }
};

module.exports = {
    connectDB
};
