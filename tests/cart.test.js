const request = require('supertest');
const app = require('../app'); 
const sequelize = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

let token, productId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password',
        role: 'customer',
    });

    const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password',
    });
    token = res.body.token;

    const product = await Product.create({
        name: 'Test Product',
        price: 100,
        stock: 10,
    });
    productId = product.id;
});

describe('Cart & Order', () => {
    it('should add product to cart', async () => {
        const res = await request(app)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ productId, quantity: 2 });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should get cart data', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.cartData).toHaveLength(1);
    });

    it('should place an order', async () => {
        const res = await request(app)
            .post('/api/cart/place-order')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Order placed successfully');
    });

    it('should fetch order history', async () => {
        const res = await request(app)
            .get('/api/cart/order-history')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.orders).toHaveLength(1);
    });

    it('should return empty cart after order', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.cartData.length).toBe(0);
    });
});

afterAll(async () => {
    await sequelize.close();
});
