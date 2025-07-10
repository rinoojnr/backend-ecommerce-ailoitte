const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const { createProduct, getAllProducts, getProductsWithFilters } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone with A16 Bionic chip.
 *               price:
 *                 type: number
 *                 example: 999
 *               stock:
 *                 type: integer
 *                 example: 20
 *               categoryId:
 *                 type: string
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product has been added successfully
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
 *                   example: Product has been added successfully.
 *       400:
 *         description: Missing required product fields
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
 *                   example: Product name, price, and stock are required fields.
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */

router.post('/', authMiddleware, roleMiddleware('admin'), upload.single('image'), createProduct);


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: Products fetched successfully
 *                 productsData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: iPhone 14 Pro
 *                       description:
 *                         type: string
 *                         example: Latest Apple smartphone
 *                       price:
 *                         type: number
 *                         example: 999
 *                       stock:
 *                         type: integer
 *                         example: 20
 *                       categoryId:
 *                         type: string
 *                         example: 1
 *                       imageURL:
 *                         type: string
 *                         example: https://res.cloudinary.com/demo/image/upload/v1627383847/sample.jpg
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Products not found
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
 *                   example: Products not found
 *       500:
 *         description: Internal server error
 */

router.get('/', authMiddleware, roleMiddleware('admin'), getAllProducts);

/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Get filtered products with pagination and search
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *         example: 1000
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *         example: 1
 *       - in: query
 *         name: searchItem
 *         schema:
 *           type: string
 *         description: Search term for product name
 *         example: iPhone
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: Products fetched successfully
 *                 totalItems:
 *                   type: integer
 *                   example: 35
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 4
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: iPhone 14 Pro
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                       stock:
 *                         type: integer
 *                         example: 20
 *                       Category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Electronics
 *       500:
 *         description: Internal server error
 */

router.get('/filter', getProductsWithFilters);


module.exports = router;