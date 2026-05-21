import express from 'express';
import { getPopularityStats, getOrderBreakdown } from '../controllers/statsController.js';

const router = express.Router();

router.get('/popularidad', getPopularityStats);
router.get('/desglose', getOrderBreakdown);

export default router;
