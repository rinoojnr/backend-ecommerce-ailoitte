const { Op } = require('sequelize');

const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        let imageURL = null;


        if (!name || !price || !stock) return res.status(400).json({ success: false, message: 'Product name, price, and stock are required fields.' });

        if (req.file) {
            const cloudinaryData = await cloudinary.uploader.upload(req.file.path);
            imageURL = cloudinaryData.secure_url;
        }

        const productData = await Product.create({ name, description, price, stock, categoryId, imageURL });
        res.status(201).json({ success: true, message: 'Product has been added successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const productsData = await Product.findAll();
        if (!productsData.length) return res.status(404).json({ success: false, message: 'Products not found' });

        res.status(200).json({ success: true, message: 'Products fetched successfully', productsData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.getProductsWithFilters = async (req, res) => {
    try {
        const { minPrice, maxPrice, categoryId, searchItem, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const where = {};

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        if (categoryId) {
            where.CategoryId = categoryId;
        }

        if (searchItem) {
            where.name = { [Op.iLike]: `%${searchItem}%` };
        }

        const productsData = await Product.findAndCountAll({
            where,
            include: [{ model: Category, attributes: ['name'] }],
            offset,
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Products fetched successfully',  
            totalItems: productsData.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(productsData.count / limit),
            products: productsData.rows,
        });
    } catch (err) {
        console.log(err);
        res.sttaus(500).json({ success: false, message: 'Internal server error.' });
    }
}