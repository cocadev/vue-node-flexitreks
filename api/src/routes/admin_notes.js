import express from 'express';
import { validationResult } from 'express-validator/check';
import AdminNotesController from '../controllers/AdminNotes';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(AdminNotesController);

router.get(
  '/',
  base.getAll()
);

router.post(
  '/',
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const request = base.request(req.body);
      request.user_id = req.user.id;
      const response = await base.controller.create(request);
      res.status(201).json(response);
    } catch (e) {
      return base.error(e, res);
    }
  }
);

export default router;
