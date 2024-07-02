import('chai').then(chai => {
    const chaiHttp = chai.default.use(require('chai-http'));
    const expect = chai.expect;
    const app = require('../../../src/app');
    const User = require('../../../src/dao/models/User.modelo');

    describe('Sessions API', () => {
        beforeEach(async () => {
            await User.deleteMany({});
        });

        it('should register a new user', async () => {
            const user = { email: 'test@example.com', password: 'password123' };
            const res = await chaiHttp.request(app).post('/api/session/register').send(user);
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('email', user.email);
        });

        it('should not allow registration with an existing email', async () => {
            const user = { email: 'test@example.com', password: 'password123' };
            await User.create(user);
            const res = await chaiHttp.request(app).post('/api/session/register').send(user);
            expect(res).to.have.status(400);
        });

        it('should login a user', async () => {
            const user = { email: 'test@example.com', password: 'password123' };
            await User.create(user);
            const res = await chaiHttp.request(app).post('/api/session/login').send(user);
            expect(res).to.have.status(200);
        });
    });
});

