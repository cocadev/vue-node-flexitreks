import express from 'express';
import HotelsController from '../controllers/Hotels';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(HotelsController);

router.get(
  '/',
  base.getAll()
);

router.post(
  '/',
  base.check(),
  base.create()
);

router.get(
  '/:id',
  base.get()
);

router.put(
  '/:id',
  base.check(),
  base.update()
);

export default router;
