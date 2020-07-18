import express from 'express';
import GalleriesController from '../controllers/Galleries';
import BaseRoutes from './base';
import AuthController from '../controllers/Auth';
const router = express.Router();
const base = new BaseRoutes(GalleriesController);

router.get(
  '/',
  AuthController.is_logged_in(),
  base.getAll()
);

router.post(
  '/',
  AuthController.is_logged_in(),
  base.check(),
  base.create()
);

router.get(
  '/:id',
  base.get()
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  base.update()
);

export default router;
