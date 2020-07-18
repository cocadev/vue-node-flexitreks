import express from 'express';
import CategoriesController from '../controllers/Categories';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(CategoriesController);

/**
 * List
 * 
 * @returns array
 */
router.get(
  '/',
  base.getAll()
);
router.get(
  '/:slug',
  base.get_by_slug()
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
