import('chai').then(chai => {
    const chaiHttp = chai.default.use(require('chai-http'));
    const expect = chai.expect;
    const app = require('../../../src/app');
    const Cart = require('../../../src/dao/models/cart.modelo');
    const User = require('../../../src/dao/models/User.modelo');

    describe('Carts API', () => {
        beforeEach(async () => {
            await Cart.deleteMany({});
            await User.deleteMany({});
        });

        it('should get all carts', async () => {
            const res = await chaiHttp.request(app).get('/api/carts');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });

        it('should create a new cart', async () => {
            const cart = { products: [] };
            const res = await chaiHttp.request(app).post('/api/carts').send(cart);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
        });

        it('should not allow premium user to add their own product to cart', async () => {
            const user = await User.create({ email: 'premium@example.com', role: 'premium' });
            const product = { name: 'Test Product', price: 10.99, owner: user._id };
            const savedProduct = await product.save();
            const cart = { userId: user._id, products: [savedProduct._id] };
            const res = await chaiHttp.request(app).post('/api/carts').send(cart);
            expect(res).to.have.status(403);
        });
    });
});
