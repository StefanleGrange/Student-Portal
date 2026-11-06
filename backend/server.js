const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables from .env file for configuration
const dotenv = require('dotenv');
dotenv.config();
// Enable Cross-Origin Resource Sharing (CORS) to allow frontend requests
app.use(cors());
// Parse incoming JSON requests into JavaScript objects
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

const startServer = async () => {
    const port = process.env.PORT || 3000;
    try {
        // Connect to MongoDB; exit process if connection fails to prevent running without a DB
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB');

        app.get("/", (req, res) => {
        res.send("Student Portal API is running");
        });

        app.use('/api/auth', authRoutes);

        app.listen(port, () => {
            console.log(`Server is running`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Graceful shutdown: exit the process if the server fails to start
    }
}

startServer();