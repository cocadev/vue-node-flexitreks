import express from 'express';
import TourBikesController from '../controllers/TourBikes';
import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';
import BikesController from '../controllers/Bikes';
const router = express.Router();

router.get(
  '/:tour_id/:tour_season_id',
  async (req, res) => {
    try {
      res.json(await BikesController.get_tour_season_bikes(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id)));
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.post(
  '/:tour_id/:tour_season_id',
  checkSchema(TourBikesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const request = h.request(req.body, null, TourBikesController.schema());

      await TourBikesController.create_bikes(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id), request.bikes);

      res.json(await BikesController.get_tour_season_bikes(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id)));

    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.put(
  '/:tour_id/:tour_season_id',
  checkSchema(TourBikesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const request = h.request(req.body, null, TourBikesController.schema());

      await TourBikesController.update_bikes(parseInt(req.params.tour_id), parseInt(req.params.tour_season_id), request.bikes);

      res.status(201).json(req.body);
    } catch (e) {
      return h.error(e, res);
    }
  }
);

export default router;
