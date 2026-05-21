import express from 'express';
import { getRecipeMappings, syncDishIngredients } from '../controllers/recipeController.js';

const router = express.Router();

router.get('/', getRecipeMappings);
router.put('/:id_platillo', syncDishIngredients);

export default router;
