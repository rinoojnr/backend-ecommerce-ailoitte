const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Required category name.' });

        const categoryData = await Category.create({ name, description });
        res.status(201).json({ success: true, message: 'Category has been created successfully.' })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categoryData = await Category.findAll();
        if (!categoryData.length) {
            return res.status(404).json({ success: false, message: 'Categories not found.' });
        }
        res.status(200).json({ success: true, message: 'Categories data fetched successfully', categoryData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;

        if (!name || !description) return res.status(400).json({ success: false, message: 'Required category name or description.' });

        const categoryData = await Category.findByPk(id);
        if (!categoryData) return res.status(404).json({ success: true, message: 'Category not found.' });

        categoryData.name = name ?? categoryData.name;
        categoryData.description = description ?? categoryData.description;
        await categoryData.save();

        res.status(200).json({ success: true, message: 'Category data updated successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryData = await Category.findByPk(id);
        if (!categoryData) return res.status(404).json({ success: false, message: 'Category not found.' });

        await categoryData.destroy();
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}