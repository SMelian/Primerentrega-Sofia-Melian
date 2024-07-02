import('chai').then(chai => {
    const chaiHttp = chai.default.use(require('chai-http'));
    const expect = chai.expect;
    const app = require('../../../src/app');
    const Product = require('../../../src/dao/models/productos.modelo'); 

    describe('Products API', () => {
        beforeEach(async () => {
            // Clear the products collection before each test
            await Product.deleteMany({});
        });

        it('should get all products', async () => {
            const res = await chaiHttp.request(app).get('/productos');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should create a new product', async () => {
            const product = { name: 'Test Product', price: 10.99, owner: 'admin' };
            const res = await chaiHttp.request(app).post('/productos/create').send(product);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', product.name);
        });

        it('should not allow non-admin to create a product', async () => {
            const product = { name: 'Test Product', price: 10.99, owner: 'user@example.com' };
            const res = await chaiHttp.request(app).post('/productos/create').send(product);
            expect(res).to.have.status(403);
        });
    });
});
