const express = require('express');
const User = require('../dao/models/User.modelo');
const { ensureAuthenticated, ensureRole, updateLastConnection } = require('../config/auth.middleware');
const upload = require('../config/multerConfig');
const nodemailer = require('nodemailer'); 
const router = express.Router();

router.get('/', ensureAuthenticated, ensureRole(['admin']), async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
    }
});


router.delete('/', ensureAuthenticated, ensureRole(['admin']), async (req, res) => {
    try {
        const cutoffDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
        const inactiveUsers = await User.find({ last_connection: { $lt: cutoffDate } });

        if (inactiveUsers.length === 0) {
            return res.status(200).send('No hay usuarios inactivos para eliminar');
        }

        for (const user of inactiveUsers) {
            await sendDeletionEmail(user.email);
        }

        await User.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });
        res.status(200).send('Usuarios inactivos eliminados');
    } catch (error) {
        res.status(500).send('Error al eliminar usuarios inactivos');
    }
});



router.put('/premium/:uid', ensureAuthenticated, ensureRole(['admin']), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        if (user.role === 'user') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userHasRequiredDocuments = requiredDocuments.every(doc => 
                user.documents.some(userDoc => userDoc.name === doc)
            );

            if (!userHasRequiredDocuments) {
                return res.status(400).send('El usuario no ha subido todos los documentos requeridos');
            }
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).send(`El rol del usuario ha sido cambiado a ${user.role}`);
    } catch (error) {
        res.status(500).send('Error al cambiar el rol del usuario');
    }
});

router.post('/:uid/documents', ensureAuthenticated, upload.array('documents'), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        user.documents.push(...documents);
        await user.save();

        res.status(200).send('Documentos subidos exitosamente');
    } catch (error) {
        res.status(500).send('Error al subir los documentos');
    }
});

module.exports = router;

