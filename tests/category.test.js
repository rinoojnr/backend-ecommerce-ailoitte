const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');

let adminToken, categoryId;

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
});

describe('Category Management', () => {

    it('should create a category', async () => {
        const res = await request(app)
            .post('/api/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Electronics', description: 'Devices and gadgets' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

        const category = await Category.findOne({ where: { name: 'Electronics' } });
        categoryId = category.id;
    });

    it('should fetch categories', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.categoryData.length).toBeGreaterThan(0);
    });

    it('should update category', async () => {
        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Updated Electronics', description: 'Updated Desc' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should delete category', async () => {
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return not found for deleted category', async () => {
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
    });

});

afterAll(async () => {
    await sequelize.close();
});
