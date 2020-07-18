import express from 'express';
import NavigationsController from '../controllers/Navigations';
import NavigationLinksController from '../controllers/NavigationLinks';
const router = express.Router();

router.get(
  '/',
  async (req, res) => {
    const data = await NavigationsController.getAll();
    res.json(data);
  }
);

router.post(
  '/',
  async (req, res) => {
    await NavigationsController.update(req.body);
    await NavigationLinksController.update(req.body);
    res.json("success");
  }
);

export default router;