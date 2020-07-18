import express from 'express';
import EnquiriesController from '../controllers/Enquiries';
import AuthController from '../controllers/Auth';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
const router = express.Router();
const base = new BaseRoutes(EnquiriesController);

router.get(
  '/',
  AuthController.is_logged_in(),
  base.getAll()
);

router.post(
  '/',
  base.check(),
  async (req, res) => {
    try {
      if (req.body.address) return base.error('Validation failed', res);

      validationResult(req).throw();
      const request = base.request(req.body);
      const response = await base.controller.create(request);
      res.status(201).json(response);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

router.get(
  '/:id',
  AuthController.is_logged_in(),
  base.get()
);

export default router;
