const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    lockedPrice: { type: DataTypes.FLOAT, allowNull: false },
});

Cart.belongsTo(User);
Cart.belongsTo(Product);

module.exports = Cart;