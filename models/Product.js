const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    imageURL: DataTypes.STRING 
});

Product.belongsTo(Category);

module.exports = Product;



