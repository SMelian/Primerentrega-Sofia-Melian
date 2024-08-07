const { Router } = require("express");
const Product = require('../dao/models/productos.modelo');
const User = require('../dao/models/User.modelo');
const Auth = require('../auth');
const { ensureAuthenticated, ensureRole } = require('../config/auth.middleware');
const nodemailer = require('nodemailer');
const config = require('../config/config');


const ProductManager = require("../ProductManager");
const router = Router();

const pm = new ProductManager();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user, 
      pass: config.pass  
    },
  });

const sendDeletionEmail = async (email, productName) => {
    const mailOptions = {
        from: 'testmelian@gmail.com',
        to: email,
        subject: 'Product Deleted Notification',
        text: `Your product "${productName}" has been deleted.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *       example:
 *         id: d5fE_asz
 *         name: Product name
 *         price: 29.99
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Returns a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/',Auth, async (req, res) => {
    try {

        let usuario = req.session.user
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


        res.render('index', {
            usuario,
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

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */


router.get('/:productId', Auth, async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await pm.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.render('productoId', { pageTitle: 'Producto elegido', product });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

  router.post('/create', ensureAuthenticated, ensureRole(['premium', 'admin']), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const owner = req.user.role === 'premium' ? req.user.email : 'admin'; 
        const product = new Product({ name, description, price, owner });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

router.post('/api/productos',Auth, async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock} = req.body;

        // llama al método addProduct de tu ProductManager para agregar el producto
        await pm.addProduct(title, description, price, thumbnail, code, stock);

        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        // Manejar errores
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

 router.put('/:id', Auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;
        
     
        const existingProduct = await pm.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        
        await pm.updateProduct(productId, updatedFields);

     
        const updatedProduct = await pm.getProductById(productId);

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/delete/:id', ensureAuthenticated, ensureRole(['premium', 'admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (req.user.role !== 'admin' && product.owner !== req.user.email) {
            return res.status(403).json({ error: 'No tiene permiso para eliminar este producto' });
        }
        await product.remove();
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});



module.exports = router;

