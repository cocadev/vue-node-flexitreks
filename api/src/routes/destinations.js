import express from 'express';
import DestinationsController from '../controllers/Destinations';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(DestinationsController);

router.get(
  '/',
  base.getAll()
);

router.get(
  '/live',
  base.getAllLive()
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
  base.delete({tables: ['tour_destinations'], field: 'destination_id'})
);

export default router;
