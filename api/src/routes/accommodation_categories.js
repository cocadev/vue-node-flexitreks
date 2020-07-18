import express from 'express';
import AccommodationCategoriesController from '../controllers/AccommodationCategories';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(AccommodationCategoriesController);

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
 * Read
 * 
 * @param   number  id
 * @returns object
 */
router.put(
  '/:id',
  base.check(),
  base.update()
);

/**
 * Remove
 * 
 * @param   number  id
 * @returns 'Success'
 */
router.delete(
  '/:id',
  base.check(),
  base.delete()
);

export default router;
