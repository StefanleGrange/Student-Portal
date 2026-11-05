const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');

const startServer = async () => {
    const port = process.env.PORT || 3000;
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB');

        app.get("/", (req, res) => {
        res.send("Student Portal API is running");
        });

        app.use('/api/auth', authRoutes);

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1); // Exit the process with an error code
    }
}

startServer();