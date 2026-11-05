const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, (req, res) => {
    res.json({ message: `Hello ${req.user.email}`, userId: req.user.id });
});

module.exports = router;