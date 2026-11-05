const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// POST /register: Creates a new user account
router.post('/register', authController.register);
// POST /login: Authenticates a user and returns a JWT
router.post('/login', authController.login);
// GET /profile: Retrieves user profile data (Protected by JWT)
router.get('/profile', protect, authController.getProfile);
// PUT /profile/:id: Updates user profile data (Protected by JWT)
router.put('/profile/:id', protect, authController.updateProfile);

module.exports = router;