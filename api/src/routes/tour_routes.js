import express from 'express';
import TourRoutesController from '../controllers/TourRoutes';
import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';
const router = express.Router();

router.get(
  '/:tour_id/:tour_season_id',
  async (req, res) => {
    try {
      res.json(await TourRoutesController.get_routes_for_season(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id)));
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.put(
  '/:tour_id/:tour_season_id',
  checkSchema(TourRoutesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const request = h.request(req.body, null, TourRoutesController.schema());

      await TourRoutesController.handle_links(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id), request.routes);

      res.status(201).json(req.body);
    } catch (e) {
      return h.error(e, res);
    }
  }
);

export default router;
