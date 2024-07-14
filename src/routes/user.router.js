const express = require('express');
const User = require('../dao/models/User.modelo');
const { ensureAuthenticated, ensureRole, updateLastConnection } = require('../config/auth.middleware');
const upload = require('../config/multerConfig');
const router = express.Router();

// Existing /premium/:uid route
router.put('/premium/:uid', ensureAuthenticated, ensureRole(['admin']), async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Check if the user is trying to upgrade to 'premium'
        if (user.role === 'user') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userHasRequiredDocuments = requiredDocuments.every(doc => 
                user.documents.some(userDoc => userDoc.name === doc)
            );

            if (!userHasRequiredDocuments) {
                return res.status(400).send('El usuario no ha subido todos los documentos requeridos');
            }
        }

        // Toggle role between 'user' and 'premium'
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).send(`El rol del usuario ha sido cambiado a ${user.role}`);
    } catch (error) {
        res.status(500).send('Error al cambiar el rol del usuario');
    }
});

// New /:uid/documents route
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
