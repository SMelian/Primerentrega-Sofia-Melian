const express = require('express');
const User = require('../dao/models/User.modelo');
const { updateLastConnection } = require('../config/auth.middleware');
const router = express.Router();

// Login 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        return res.status(401).send({ error: 'Invalid credentials' });
    }
    await updateLastConnection(req, res, () => {});
    res.status(200).send(user);
});

// Logout 
router.post('/logout', async (req, res) => {
    const userId = req.body.userId; // Or get the userId from the session/token
    const user = await User.findById(userId);
    if (user) {
        user.last_connection = new Date();
        await user.save();
    }
    res.status(200).send({ message: 'Logged out successfully' });
});

module.exports = router;
