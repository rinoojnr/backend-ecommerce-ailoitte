const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');
const User = require('./User');
const OrderItem = require('./OrderItem');

const Order = sequelize.define('Order', {
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },

});

Order.belongsTo(User);
Order.hasMany(OrderItem);

module.exports = Order;