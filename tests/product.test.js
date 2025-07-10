const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

jest.mock('../config/cloudinary', () => ({
    uploader: {
        upload: jest.fn().mockResolvedValue({
            secure_url: 'http://mocked.cloudinary.com/fakeimage.jpg'
        })
    }
}));

let adminToken, categoryId, createdProductId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app).post('/api/auth/register').send({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
    });

    const res = await request(app).post('/api/auth/login').send({
        email: 'admin@example.com',
        password: 'admin123'
    });

    adminToken = res.body.token;

    const categoryRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics', description: 'Gadgets' });

    const category = await Category.findOne({ where: { name: 'Electronics' } });
    categoryId = category.id;
});

describe('Product Management', () => {

    it('should create a new product with image', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .field('name', 'Smartphone')
            .field('description', 'Latest phone')
            .field('price', 299.99)
            .field('stock', 10)
            .field('categoryId', categoryId)
            .attach('image', '__tests__/dummy-image.jpg');

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

        const product = await Product.findOne({ where: { name: 'Smartphone' } });
        createdProductId = product.id;
    });

    it('should get all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.productsData.length).toBeGreaterThan(0);
    });

    it('should get products with filters (price range & name)', async () => {
        const res = await request(app).get('/api/products/filter')
            .query({
                minPrice: 100,
                maxPrice: 400,
                searchItem: 'smart',
                categoryId,
                page: 1,
                limit: 5
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.products.length).toBeGreaterThanOrEqual(1);
        expect(res.body.totalPages).toBeGreaterThan(0);
    });

});

afterAll(async () => {
    await sequelize.close();
});
