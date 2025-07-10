const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity) return res.status(400).json({ success: false, message: 'Required productid and quantity' })

        const productData = await Product.findByPk(productId);
        if (!productData) return res.status(404).json({ success: false, message: 'Product not found.' });

        const existingCartData = await Cart.findOne({ where: { UserId: userId, ProductId: productId }});
        if (existingCartData) {
            existingCartData.quantity += quantity;
            await existingCartData.save();
        } else {
            await Cart.create({ 
                UserId: userId,
                ProductId: productId,
                quantity,
                lockedPrice: productData.price
            });
        }

        res.status(200).json({ success: true, message: 'Product added to cart' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartData = await Cart.findAll({ 
            where: { UserId: userId },
            include: [{ model: Product, attributes: ['name', 'price', 'imageURL'] }]
        });

        if (!cartData || !cartData.length) return res.status(200).json({ success: true, message: 'There are no products in the cart.' });
        res.status(200).json({ success: true, message: 'Cart data fetched successfully.', cartData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const deletedCartData = await Cart.destroy({ where: { UserId: userId, ProductId: productId }});
        if (!deletedCartData) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

        res.status(200).json({ success: true, message: 'Item removed from cart.' });
    } catch (err) {
        console.log(err);
        res.status({ success: false, message: 'Internal server error' });
    }
}

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartData = await Cart.findAll({
            where: { UserId: userId },
            include: [Product]
        });

        if (!cartData.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });

        const totalAmount = cartData.reduce((sum, item) => {
            return sum + item.quantity * item.lockedPrice;
        }, 0);

        const orderData = await Order.create({
            UserId: userId,
            totalAmount
        });

        const orderItemsData = cartData.map((item) => ({
            OrderId: orderData.id,
            ProductId: item.ProductId,
            quantity: item.quantity,
            priceAtPurchase: item.lockedPrice,
        }));
      
        await OrderItem.bulkCreate(orderItemsData);
        await Cart.destroy({ where: { UserId: userId } });

        return res.status(201).json({ success: true, message: 'Order placed successfully' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const orderData = await Order.findAll({
            where: { UserId: userId },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['name', 'imageURL']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, message: 'Orders fetched successfully', orders: orderData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orderData = await Order.findAll({
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['name', 'imageURL']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });

        if (!orderData || !orderData.length) {
            return res.status(404).json({ success: false, message: 'No orders found.' });
        }

        return res.status(200).json({ success: true, message: 'Order history fetched successfully.', orderData });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}