const { Router } = require("express");

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('chat', { pageTitle: 'Chat Service'}); // Render the 'index' view with the list of products
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  });


  module.exports = router;