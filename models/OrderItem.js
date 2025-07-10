const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtPurchase: { type: DataTypes.FLOAT, allowNull: false },
});

OrderItem.belongsTo(Product);

module.exports = OrderItem;
