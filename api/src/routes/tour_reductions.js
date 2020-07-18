import express from 'express';
import TourReductions from '../controllers/TourReductions';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(TourReductions);

router.get(
  '/:tour_id/:tour_season_id',
  async (req, res) => {
    try {
      res.json(await base.controller.get_reductions(parseInt(req.params.tour_id), [parseInt(req.params.tour_season_id)]));
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.post(
  '/:tour_id/:tour_season_id',
  base.check(),
  async (req, res) => {
    try {
      ['percent', 'cost', 'input_min', 'input_max', 'input_quantity', 'output_min', 'output_max', 'output_quantity', 'child_calc_room', 'child_calc_accommodation']
        .forEach(key => {
          if (req.body[key] === '' || isNaN(req.body[key])) req.body[key] = null;
        });

      const request = base.request(req.body, null, base.controller.schema());
      request.tour_id = parseInt(req.params.tour_id);
      request.tour_season_id = parseInt(req.params.tour_season_id);

      res.status(201).json(await base.controller.create(request));
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.get(
  '/:tour_id/:tour_season_id/:id',
  base.get()
);

router.put(
  '/:tour_id/:tour_season_id/:id',
  base.check(),
  base.update()
);

router.delete(
  '/:tour_id/:tour_season_id/:id',
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return base.notFound(res);
      const instance = await base.controller.get(id);
      if (!instance) return base.notFound(res);

      await base.controller.delete(id);
      res.json({ success: true });
    } catch (e) {
      return base.error(e, res);
    }
  }
);

export default router;
