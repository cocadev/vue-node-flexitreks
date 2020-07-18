import express from 'express';
import RoomTypesControllers from '../controllers/RoomTypes';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(RoomTypesControllers);

router.get(
  '/',
  base.getAll({order: 'name'})
);

router.post(
  '/',
  base.check(),
  base.create()
);

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
