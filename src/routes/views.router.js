const { Router } = require("express");

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('home', { pageTitle: 'Home - ingreso con Github'}); 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/login', async (req, res) => {
    try {
        res.render('login', { pageTitle: 'Home - ingreso con Github'}); 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  });



  module.exports = router;