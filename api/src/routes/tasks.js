import express from 'express';
import TasksController from '../controllers/Tasks';
const router = express.Router();

router.post(
  '/',
  TasksController.trigger()
);

export default router;
