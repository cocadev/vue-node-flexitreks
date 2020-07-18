import express from 'express';
import AuthController from '../controllers/Auth';
import UsersController from '../controllers/Users';
import BaseRoutes from './base';
import { validationResult } from 'express-validator/check';
const router = express.Router();
const base = new BaseRoutes(UsersController);

router.post(
  '/login',
  base.check(),
  async (req, res) => {
    try {
      validationResult(req).throw();

      const login = await AuthController.login(req.body);
      res.json(login);
    } catch (e) {
      base.error(e, res);
    }
  }
);

router.get(
  '/users',
  AuthController.is_logged_in(),
  base.getAll()
);

export default router;
