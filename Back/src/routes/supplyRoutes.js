import express from 'express';
import { getSupplyMappings, syncProviderIngredients } from '../controllers/supplyController.js';

const router = express.Router();

router.get('/', getSupplyMappings);
router.put('/:id_proveedor', syncProviderIngredients);

export default router;
