const jwt = require("jsonwebtoken");

// Middleware to protect routes: checks for and validates the JWT in the request header
const protect = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        // Ensure the Authorization header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        // Extract the token string from the header
        const token = authHeader.split(" ")[1];
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid or expired authentication token" });
    }
}

module.exports = protect;