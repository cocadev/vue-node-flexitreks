import express from 'express';
import DecksController from '../controllers/Decks';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(DecksController);

/**
 * List
 * 
 * @returns array
 */
router.get(
  '/',
  base.getAll({order: 'name'})
);

/**
 * Create
 * 
 * @param   string  name
 * @returns object
 */
router.post(
  '/',
  base.check(),
  base.create()
);

/**
 * Update
 * 
 * @param   string  name
 * @returns object
 */
router.put(
  '/:id',
  base.check(),
  base.update()
);

router.delete(
  '/:id',
  base.check(),
  base.delete()
);


export default router;
