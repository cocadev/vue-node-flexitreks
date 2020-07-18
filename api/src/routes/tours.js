import express from 'express';
import passport from 'passport';
import ToursController from '../controllers/Tours';
import MediaController from '../controllers/Media';
import HotelsController from '../controllers/Hotels';
import RestaurantsController from '../controllers/Restaurants';
import AuthController from '../controllers/Auth';
import TourItinerariesController from '../controllers/TourItineraries';
import TourDocumentationController from '../controllers/Documentation';
import TourMetaController from '../controllers/TourMeta';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
import TourWeatherController from '../controllers/Weather';
import BikesController from '../controllers/Bikes';
const router = express.Router();
const base = new BaseRoutes(ToursController);
const itineraryBase = new BaseRoutes(TourItinerariesController);
const documentationBase = new BaseRoutes(TourDocumentationController);
const weatherBase = new BaseRoutes(TourWeatherController);

router.get(
  '/',
  base.getAllLive()
);

router.get(
  '/all/',
  AuthController.is_logged_in(),
  base.getAll()
);

router.post(
  '/',
  AuthController.is_logged_in(),
  base.check(),
  ToursController.create_route()
);

router.get(
  '/list/:ids',
  AuthController.is_logged_in(),
  base.get_by_ids()
);

router.get(
  '/:id/hotels',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      res.json(await HotelsController.get_hotels_for_tour(parseInt(req.params.id)));
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

router.get(
  '/:id/restaurants',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      res.json(await RestaurantsController.get_restaurants_for_tour(parseInt(req.params.id)));
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

router.get(
  '/:id/:tour_season_id/bikes',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      res.json(await BikesController.get_tour_bikes(parseInt(req.params.id), parseInt(req.params.tour_season_id)));
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

router.get(
  '/:id/itineraries',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      res.json(await TourItinerariesController.get_itineraries(parseInt(req.params.id), null));
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

/**
 * Update itineraries for the tour
 * Ensure you send ALL itineraries or they will be deleted
 * 
 * @param   array   itineraries
 *    @param  number  id
 *    @param  string  title
 *    @param  string  content
 *    @param  string  type
 *    @param  number  order
 *    @param  number  media_id
 * @returns object
 */
router.put(
  '/:id/itineraries',
  AuthController.is_logged_in(),
  itineraryBase.check(),
  async (req, res) => {
    try {
      const tour_id = parseInt(req.params.id);

      if (Array.isArray(req.body) && req.body.length === 0) {
        return res.json(await TourItinerariesController.update(tour_id, []));
      }

      validationResult(req).throw();
      req.body.forEach(i => i.tour_id = tour_id);
      res.json(await TourItinerariesController.update(tour_id, req.body));
    } catch (e) {
      return itineraryBase.error(e, res);
    }
  }
);

router.get(
  '/:id/documentation',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      const docs = await TourDocumentationController.get(parseInt(req.params.id));
      if (!docs) return res.status(404).json({ error: 'Documentation not found' });
      res.json(docs);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

router.put(
  '/:id/documentation',
  AuthController.is_logged_in(),
  documentationBase.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const tour_id = parseInt(req.params.id);

      if (req.body.id) {
        const request = documentationBase.request(req.body, parseInt(req.body.id));
        request.tour_id = tour_id;
        const result = await TourDocumentationController.update(request);
        res.json(result);
      } else {
        const request = documentationBase.request(req.body);
        request.tour_id = tour_id;
        const result = await TourDocumentationController.create(request);
        res.json(result);
      }      
    } catch (e) {
      return documentationBase.error(e, res);
    }
  }
);

router.put(
  '/:id/weather',
  AuthController.is_logged_in(),
  weatherBase.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const tour_id = parseInt(req.params.id);
      const request = weatherBase.request(req.body);
      if (request.weather === undefined) return weatherBase.error('Supply weather data', res);
      
      request.weather.forEach(r => r.tour_id = tour_id);
      const weather = request.weather;
      const current = await weatherBase.controller.get(tour_id);

      await Promise.all(weather.map(w => weatherBase.controller.create_or_update(w, current)));

      const newWeather = await weatherBase.controller.get(tour_id);
      res.json(newWeather);

    } catch (e) {
      return weatherBase.error(e, res);
    }
  }
);

router.get(
  '/:id/meta',
  AuthController.is_logged_in(),
  async (req, res) => {
    try {
      res.json(await TourMetaController.get(parseInt(req.params.id)));
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  }
);

const handleDraftTours = (instance, req, res, next) => {
  if (instance.status !== 'live') {
    passport.authenticate('jwt', { session: false }, function (error, user) {
      if (error || !user) return base.error('Unauthorized', res);
      res.json(instance);
    })(req, res, next);
  } else {
    res.json(instance);
  }
};

router.get(
  '/:slug',
  async (req, res, next) => {
    try {
      const instance = await base.controller.get_by_slug(String(req.params.slug));
      if (!instance) return next();
      return handleDraftTours(instance, req, res, next);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.get(
  '/:id',
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return base.notFound(res);
      const instance = await base.controller.get(id);
      if (!instance) return base.notFound(res);
      return handleDraftTours(instance, req, res, next);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.put(
  '/:id',
  AuthController.is_logged_in(),
  base.check(),
  ToursController.update_route()
);

router.put(
  '/re/orders',
  async (req, res, next) => {
    try {
      const ids = req.body.orders;
      await MediaController.update_media_order(ids);
      res.json(ids)
    } catch (e) {
      return base.error(e, res);
    }
  }
);

export default router;
