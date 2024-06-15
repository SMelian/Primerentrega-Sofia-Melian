const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../dao/models/User.modelo');
const config = require('../config/config');  
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.user,
        pass: config.pass
    },
});

// Ruta para solicitar la recuperación de contra
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        const mailOptions = {
            from: 'testmelian@gmail.com',
            to: user.email,
            subject: 'Enlace para restablecer la contraseña',
            text: `Por favor haga clic en el siguiente enlace para restablecer su contraseña: http://${req.headers.host}/reset-password/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('Correo enviado con éxito');
    } catch (error) {
        res.status(500).send('Error al enviar el correo de recuperación');
    }
});

//restablecer la contra
router.get('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send('El enlace para restablecer la contraseña es inválido o ha expirado.');
        }
        res.render('reset-password', { token: req.params.token });
    } catch (error) {
        res.status(500).send('Error al restablecer la contraseña');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).send('El enlace para restablecer la contraseña es inválido o ha expirado.');
        }

        if (user.password === password) {
            return res.status(400).send('La nueva contraseña no puede ser igual a la anterior');
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).send('Contraseña restablecida con éxito');
    } catch (error) {
        res.status(500).send('Error al restablecer la contraseña');
    }
});

module.exports = router;

