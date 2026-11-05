const User = require("../models/user");
const bcrypt = require("bcryptjs"); // Library for hashing passwords securely
const jwt = require("jsonwebtoken"); // Library for creating/managing session 

// Create a JWT token containing the user's ID and username, valid for 1 hour
const createToken = (user) => {
    const payload = {
        id: user._id.toString(),
        username: user.username
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Register a new user: checks for duplicates, hashes password, and saves to DB
const register = async (req, res) => {
    try {
        const { username, email, phone, dob, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" });
        }

        // Hash the password (Security Requirement)
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            phone,
            dob: new Date(dob),
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};

// Login user: finds user by username, compares passwords, and returns a JWT
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare plain text password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                dob: user.dob
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

// Get profile: retrieves user data based on the ID in the authenticated request
const getProfile = (req, res) => {
    User.findById(req.user.id).then(user => {
        res.json({ user: { username: user.username, email: user.email, phone: user.phone, dob: user.dob } });
    }).catch(err => res.status(500).json({ message: "Error fetching profile" }));
};

// Update profile: modifies email, phone, and DOB for the authenticated user
const updateProfile = async (req, res) => {
    try {
        const { email, phone, dob } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { email, phone, dob },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

module.exports = { register, login, getProfile, updateProfile };