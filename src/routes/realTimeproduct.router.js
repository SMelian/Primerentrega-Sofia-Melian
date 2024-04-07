const { Router } = require("express");
const ProductManager = require("../ProductManager"); 

const router = Router();

const pm = new ProductManager(); 

router.get('/', async (req, res) => {
    try {
       // let { limit = 10, page = 1, sort, query } = req.query;
        let { limit = 10, page = 1, query } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        const options = {
            limit: limit,
            page: page,
           // sort: sort ? JSON.parse(sort) : { createdAt: -1 } 
        };

    
        const products = await pm.getProducts(options);
        console.log(products);

        // pagina actual
        const currentPageProducts = products.docs;

        // Calculo de detalles
        const totalPages = products.totalPages;
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;


        res.render('realTimeProducts', {
            pageTitle: 'Lista de Productos',
            productos: currentPageProducts,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        if (!title || !description || !code || !price || !stock ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newProduct = await pm.addProduct(title, description, price, thumbnail, code, stock);
        res.render('index', {pageTitle:'producto agregado'});

        //res.status(201).json(newProduct);
       // req.io.emit("NewProduct",newProduct)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });

    }
});
module.exports = router;