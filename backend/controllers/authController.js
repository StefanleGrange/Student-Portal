const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const createToken = (user) => {
    const payload = {
        id: user._id.toString(),
        email: user.email
    };
    // Return the token (assuming you have a JWT library set up)
    return jwt.sign(payload, process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN });
};

const register = async (req, res) => {
    try{
        const{
            username,
            email,
            phone,
            birthdate,
            password
        } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email: normalizedEmail,
            phone,
            birthdate,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful",
            user: {
                username,
                email: normalizedEmail
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
}

const login = async (req, res) => {
    const {
    email,
    password
    } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            token:token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};


module.exports = {
register,
login
};