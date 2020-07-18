import express from 'express';
import RegionsController from '../controllers/Regions';
import BaseRoutes from './base';
import AuthController from '../controllers/Auth';
const router = express.Router();
const base = new BaseRoutes(RegionsController);

router.get(
  '/',
  base.getAll({order: 'name'})
);

router.post(
  '/',
  AuthController.is_logged_in(),
  base.check(),
  base.create()
);

router.get(
  '/:slug',
  base.get_by_slug()
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.update()
);

router.delete(
  '/:id',
  base.check(),
  base.delete({tables: ['tour_regions', 'destination_regions'], field: 'region_id'})
);

export default router;
