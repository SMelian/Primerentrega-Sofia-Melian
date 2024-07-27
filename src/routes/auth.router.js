const express = require('express');
const User = require('../dao/models/User.modelo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { updateLastConnection } = require('../config/auth.middleware');
const config = require('../config/config');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        // Update last connection
        await updateLastConnection(req, res, () => {});

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

        res.status(200).send({ token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    const { userId } = req.body;

    try {
        // Find and update user last connection time
        const user = await User.findById(userId);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }

        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;
