const mongoose = require('mongoose');
// Define Mongoose schema for the 'users' collection in MongoDB
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true } // Spec says 'dob'
});
 // Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);