import express from 'express';
import OffersController from '../controllers/Offers';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(OffersController);

router.get(
  '/',
  AuthController.is_logged_in(),
  base.getAll({order: 'name'})
);

router.post(
  '/',
  AuthController.is_logged_in(),
  base.check(),
  base.create()
);

router.get(
  '/public',
  base.getAll({
    status: 'live',
    order: 'name'
  })
);

router.get(
  '/:slug',
  base.get_by_slug(true)
);

router.get(
  '/:id',
  AuthController.is_logged_in(),
  base.get()
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.update()
);

router.delete(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.delete()
);

export default router;
