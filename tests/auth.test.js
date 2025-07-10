const request = require('supertest');
const app = require('../app'); 
const sequelize = require('../config/database'); 

beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

describe('User Authentication', () => {
    let token;

    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({
                email: 'test@example.com',
                password: '123456',
                role: 'customer',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User registered successfully.');
    });

    test('should not register with same email again', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({
                email: 'test@example.com',
                password: '123456',
                role: 'customer',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email already exists.');
    });

    test('should login user and return token', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: 'test@example.com',
                password: '123456',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();

        token = res.body.token; 
    });

    test('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpass',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid email or password.');
    });

    test('should not login with unregistered email', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({
                email: 'noaccount@example.com',
                password: '123456',
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Account with this email was not found.');
    });
});
