import express from 'express';
import multer from 'multer';
import { Op } from 'sequelize';
import { authenticateToken } from '../middleware/auth.js';
import { Carpark, User, UserFavoriteCarpark, sequelize } from '../models/index.js';
import { loadCarparkData } from '../services/csvLoader.js';
import fs from 'fs';
import path from 'path';
import { validateFileType } from '../middleware/fileValidation.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Carparks
 *   description: Carpark management and operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Carpark:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         car_park_no:
 *           type: string
 *         address:
 *           type: string
 *         x_coord:
 *           type: number
 *         y_coord:
 *           type: number
 *         short_term_parking:
 *           type: string
 *         free_parking:
 *           type: string
 *         night_parking:
 *           type: boolean
 *         car_park_decks:
 *           type: integer
 *         gantry_height:
 *           type: number
 *         car_park_basement:
 *           type: boolean
 */

/**
 * @swagger
 * /api/carparks:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get filtered list of carparks
 *     tags: [Carparks]
 *     parameters:
 *       - in: query
 *         name: freeParking
 *         schema:
 *           type: boolean
 *         description: Filter carparks by free parking availability
 *       - in: query
 *         name: nightParking
 *         schema:
 *           type: boolean
 *         description: Filter carparks by night parking availability
 *       - in: query
 *         name: minHeight
 *         schema:
 *           type: number
 *         description: Minimum gantry height in meters
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of items per page (default: 10)"
 *     responses:
 *       200:
 *         description: Successfully retrieved carparks list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   description: Total number of carparks matching the filters
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 carparks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Carpark'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid minHeight value"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal server error"
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { freeParking, nightParking, minHeight, page = 1, limit = 10 } = req.query;

    const where = {};

    if (freeParking === 'true') {
      where.free_parking = { [Op.ne]: 'NO' };  // Filters carparks that offer free parking
    } else if (freeParking === 'false') {
      where.free_parking = 'NO';  // Filters carparks that do not offer free parking
    }

    if (nightParking === 'true') {
      where.night_parking = true;  // Filters carparks that offer night parking
    } else if (nightParking === 'false') {
      where.night_parking = false;  // Filters carparks that do not offer night parking
    }

    if (minHeight) {
      where.gantry_height = { [Op.gte]: parseFloat(minHeight) };  // Filters carparks that meet vehicle height
    }

    const offset = (page - 1) * limit;
    const carparks = await Carpark.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      totalItems: carparks.count,
      totalPages: Math.ceil(carparks.count / limit),
      currentPage: parseInt(page),
      carparks: carparks.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carparks/{id}/favorite:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add carpark to authenticated user's favorites
 *     tags: [Carparks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the carpark
 *     responses:
 *       200:
 *         description: Carpark successfully added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid carpark ID format"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       404:
 *         description: Carpark not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Carpark not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal server error"
 */
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Find carpark by UUID now
    const carpark = await Carpark.findByPk(id, { transaction });
    if (!carpark) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Carpark not found' });
    }

    // Add to favorites using CarparkId
    await UserFavoriteCarpark.findOrCreate({
      where: {
        UserId: req.user.id,
        CarparkId: carpark.id  // Using UUID instead of car_park_no
      },
      transaction
    });

    await transaction.commit();
    res.status(200).json({
      message: 'Added to favorites',
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carparks/favorites:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get authenticated user's favorite carparks
 *     tags: [Carparks]
 *     responses:
 *       200:
 *         description: Successfully retrieved user's favorite carparks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Carpark'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal server error"
 */
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Carpark,
        as: 'favorites',
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username
      },
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/carparks/upload:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Upload a new CSV file to update carpark data (Admin only)
 *     tags: [Carparks]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing carpark data
 *     responses:
 *       200:
 *         description: CSV file processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "CSV file processed successfully"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No file uploaded"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       415:
 *         description: Unsupported file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Only CSV files are supported"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal server error"
 */
router.post('/upload', 
  authenticateToken, 
  upload.single('file'), 
  validateFileType(
    ['text/csv', 'application/csv'],
    ['.csv']
  ),
  async (req, res) => {
    try {
      const filePath = req.file.path;
      await loadCarparkData(filePath);
      
      // Clean up the uploaded file after processing
      fs.unlinkSync(filePath);
      
      res.status(200).json({ message: 'CSV file processed successfully' });
    } catch (error) {
      // Clean up the uploaded file in case of error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
