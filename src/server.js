const app = require('./app');
const { connectDB } = require('./config/db');
const { serverPort, mongodbURL } = require('./secret');

/**
 * 1st server running then database connection establish
 */
app.listen(serverPort, async () => {
    console.log(`App is running on port ${serverPort}`);
    await connectDB();
});
