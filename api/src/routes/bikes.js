import express from 'express';
import BikesController from '../controllers/Bikes';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(BikesController);

/**
 * List
 *
 * @returns array
 */
router.get(
  '/',
  base.getAll({order: 'default_order'})
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

/**
 * Remove
 *
 * @param   number  id
 * @returns 'Success'
 */
router.delete(
  '/:id',
  base.check(),
  base.delete({tables: ['tour_bikes'], field: 'bike_id'})
);

export default router;
