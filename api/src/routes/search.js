import express from 'express';
import SearchController from '../controllers/Search';
import BaseRoutes from './base';
const router = express.Router();
const base = new BaseRoutes(SearchController);

router.get(
  '/',
  base.getAll()
);

export default router;
