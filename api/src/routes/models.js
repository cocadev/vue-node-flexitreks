import express from 'express';
import MarkupModelsController from '../controllers/MarkupModels';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
const router = express.Router();
const base = new BaseRoutes(MarkupModelsController);

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
  '/by_id/:markup_model_id',
  async (req, res) => {
    const response = await base.controller.get_model_by_id(Number(req.params.markup_model_id));
    if (!response) return base.notFound(res);

    res.json(response);
  }
);

router.get(
  '/:season_id/',
  async (req, res) => {
    const response = await base.controller.get_models_for_season(Number(req.params.season_id));
    res.json(response);
  }
);

router.get(
  '/:season_id/:markup_model_id',
  async (req, res) => {
    const response = await base.controller.get_model(Number(req.params.season_id), Number(req.params.markup_model_id));
    if (!response) return base.notFound(res);

    res.json(response);
  }
);

router.put(
  '/:season_id/:markup_model_id',
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const model = await base.controller.get_model(Number(req.params.season_id), Number(req.params.markup_model_id));
      if (!model) return base.notFound(res);

      const request = base.request(req.body.model, model.id);
      const response = await base.controller.update(request);

      res.json(response);
    } catch (e) {
      let errors = await base.controller.get_errors_rates(req.body.removedRatesIds);
      errors = errors.map(item => item.id).join(',');
      return base.error(errors?errors:e, res);
    }
  }
);

router.post(
  '/:season_id/:markup_model_id',
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const model = await base.controller.get_model(Number(req.params.season_id), Number(req.params.markup_model_id));
      if (!model) return base.notFound(res);

      const request = base.request(req.body, model.id);
      await base.controller.add_rates(request);
      const response = await base.controller.get_model(Number(req.params.season_id), Number(req.params.markup_model_id));

      res.json(response);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.delete(
  '/:id',
  base.check(),
  base.delete()
);

export default router;
