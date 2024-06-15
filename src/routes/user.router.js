const express = require('express');
const User = require('../dao/models/User.modelo');
const { ensureAuthenticated, ensureRole } = require('../config/auth.middleware');
const router = express.Router();

router.put('/premium/:uid', ensureAuthenticated, ensureRole(['admin']), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).send(`El rol del usuario ha sido cambiado a ${user.role}`);
    } catch (error) {
        res.status(500).send('Error al cambiar el rol del usuario');
    }
});

module.exports = router;
