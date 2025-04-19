import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome page
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the Behavioral Coach API
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Behavioral Coach API',
    status: 'ok'
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns health status of the API
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export { router as indexRoutes }; 