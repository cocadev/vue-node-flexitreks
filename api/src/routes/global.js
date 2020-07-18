import express from 'express';
import DestinationsController from '../controllers/Destinations';
import ToursController from '../controllers/Tours';
import GlobalOptions from '../controllers/GlobalOptions';
import ReviewsController from '../controllers/Reviews';
import AuthController from '../controllers/Auth';
const router = express.Router();

router.get(
  '/',
  async (req, res) => {
    const data = {};
    const [
      destinations,
      total,
      options,
      reviews
    ] = await Promise.all([
      DestinationsController.getAll(),
      ToursController.count(),
      GlobalOptions.get(),
      ReviewsController.count()
    ]);

    data.tour_count = total && total.length ? total[0].count : 0;
    data.reviews_count = reviews && reviews.length ? reviews[0].count : 0;

    data.destinations = destinations.map(d => {
      return  {
        name: d.name,
        slug: d.slug
      };
    });

    data.options = options;

    res.json(data);
  }
);

router.post(
  '/',
  AuthController.is_logged_in(),
  async (req, res) => {
    await GlobalOptions.update(req.body);
    res.json(await GlobalOptions.get());
  }
);

export default router;
