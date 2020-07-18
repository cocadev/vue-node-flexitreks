import express from 'express';
import CurrenciesController from '../controllers/Currencies';
import { validationResult } from 'express-validator/check';
import BaseRoutes from './base';
import h from '../utils/helpers';
import ExchangeRatesController from '../controllers/ExchangeRates';
const router = express.Router();
const base = new BaseRoutes(CurrenciesController);
const baseRates = new BaseRoutes(ExchangeRatesController);

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

router.put(
  '/:currency_id/:season_id',
  baseRates.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const currency_id = Number(req.params.currency_id);
      const season_id = Number(req.params.season_id);

      const current = await baseRates.controller.get_rate(currency_id, season_id);
      const request = h.request(req.body, null, baseRates.controller.schema());
      request.currency_id = currency_id;
      request.season_id = season_id;

      let response;

      if (!current) {
        response = await baseRates.controller.create(request);
      } else {
        response = await baseRates.controller.update(request);
      }

      res.status(201).json(response);
    } catch (e) {
      return base.error(e, res);
    }
  },
);

router.delete(
  '/:id',
  base.check(),
  base.delete()
);

export default router;
