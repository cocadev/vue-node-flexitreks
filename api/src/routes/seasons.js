import express from 'express';
import SeasonsController from '../controllers/Seasons';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(SeasonsController);

router.get(
  '/',
  base.getAll({order: 'name'})
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

router.delete(
  '/:id',
  base.check(),
  base.delete()
);



export default router;
