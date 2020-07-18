import express from 'express';
import HomepageCollectionsController from '../controllers/HomepageCollections';
const router = express.Router();

router.get(
  '/',
  async (req, res) => {
    const data = await HomepageCollectionsController.get();
    res.json(data);
  });


router.post(
  '/',
  // AuthController.is_logged_in(),
  async (req, res) => {
    await HomepageCollectionsController.update(req.body);
    res.json(await HomepageCollectionsController.get());
  }
);
export default router;