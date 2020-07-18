import express from 'express';
import ReviewsController from '../controllers/Reviews';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(ReviewsController);

router.get(
  '/',
  base.getAll()
);

router.get(
  '/:tour_id',
  async (req, res) => {
    try {
      const tour_id = parseInt(req.params.tour_id);
      if (!tour_id || isNaN(tour_id)) return base.notFound(res);
      const instance = await base.controller.get_reviews_for_tour(tour_id);
      if (!instance) return base.notFound(res);
      res.json(instance);
    } catch (e) {
      return base.error(e, res);
    }
  }
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

export default router;
