const express = require('express');

const { 
    addToCart, 
    getCart, 
    removeFromCart, 
    placeOrder, 
    getOrderHistory,
    getAllOrders 
} = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();


/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product added to cart
 *       400:
 *         description: Missing productId or quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Required productid and quantity
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Product not found.
 *       500:
 *         description: Internal server error
 */

router.post('/', authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data fetched successfully or cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart data fetched successfully.
 *                 cartData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       lockedPrice:
 *                         type: number
 *                         example: 499.99
 *                       Product:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Wireless Headphones
 *                           price:
 *                             type: number
 *                             example: 499.99
 *                           imageURL:
 *                             type: string
 *                             example: https://res.cloudinary.com/demo/image/upload/v1627383847/headphones.jpg
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/', authMiddleware, getCart);

/**
 * @swagger
 * /api/cart/place-order:
 *   post:
 *     summary: Place an order based on the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *       400:
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart is empty.
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.post('/place-order', authMiddleware, placeOrder);

/**
 * @swagger
 * /api/cart/order-history:
 *   get:
 *     summary: Get the authenticated user's order history
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Orders fetched successfully
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       totalAmount:
 *                         type: number
 *                         example: 1499.97
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-07-10T10:00:00Z
 *                       OrderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             quantity:
 *                               type: integer
 *                               example: 3
 *                             priceAtPurchase:
 *                               type: number
 *                               example: 499.99
 *                             Product:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: Wireless Headphones
 *                                 imageURL:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/demo/image/upload/v1627383847/headphones.jpg
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */

router.get('/order-history', authMiddleware, getOrderHistory);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a product from the user's cart by product ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from the cart
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item removed from cart.
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Item not found in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Item not found in cart.
 *       500:
 *         description: Internal server error
 */

router.delete('/:productId', authMiddleware, removeFromCart);

/**
 * @swagger
 * /api/cart/all-order-history:
 *   get:
 *     summary: Get all users' order histories (Admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order history fetched successfully.
 *                 orderData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       UserId:
 *                         type: integer
 *                         example: 10
 *                       totalAmount:
 *                         type: number
 *                         example: 2499.99
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-07-10T13:00:00Z
 *                       OrderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             ProductId:
 *                               type: integer
 *                               example: 3
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *                             priceAtPurchase:
 *                               type: number
 *                               example: 1249.99
 *                             Product:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: Gaming Laptop
 *                                 imageURL:
 *                                   type: string
 *                                   example: https://res.cloudinary.com/demo/image/upload/v1627383847/laptop.jpg
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No orders found.
 *       500:
 *         description: Internal server error
 */

router.get('/all-order-history', authMiddleware, roleMiddleware('admin'), getAllOrders);


module.exports = router;