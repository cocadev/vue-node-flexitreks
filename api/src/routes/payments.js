import express from 'express';
import PaymentsController from '../controllers/Payments';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
import bodyParser from 'body-parser';
import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';
const router = express.Router();
const base = new BaseRoutes(PaymentsController);

router.get(
  '/',
  AuthController.is_logged_in(),
  base.getAll()
);

router.post(
  '/',
  base.check(),
  base.controller.create_request()
);

router.post(
  '/booking/',
  AuthController.is_logged_in(),
  checkSchema(base.controller.private_schema()),
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const request = h.request(req.body, null, base.controller.private_schema());
      const response = await base.controller.create(request);
      res.status(201).json(response);
    } catch (e) {
      return base.error(e, res);
    }
  },
);

router.post(
  '/respond',
  bodyParser.text({ type: '*/*' }),
  base.controller.payment_response()
);

router.get(
  '/:id',
  AuthController.is_logged_in(),
  base.get()
);

export default router;
