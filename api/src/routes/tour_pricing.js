import express from 'express';
import TourPricingCategoriesController from '../controllers/TourPricingCategories';
import { checkSchema, validationResult } from 'express-validator/check';
import h from '../utils/helpers';
const router = express.Router();

/**
 * Prepare the category request against the schema, adding required fields from the URL
 * 
 * @param {object} req 
 * @param {object} schema 
 */
const prepare_category = function(req, schema) {
  const category = h.request(req.body, req.params.id ? parseInt(req.params.id) : null, schema);
  const tour_id = parseInt(req.params.tour_id);
  const tour_season_id = parseInt(req.params.tour_season_id);
  category.tour_id = tour_id;
  category.tour_season_id = tour_season_id;
  category.prices = category.prices || [];
  const prices = category.prices.map(price => {
    price.tour_id = tour_id;
    price.tour_season_id = tour_season_id;
    return price;
  });
  delete category.prices;
  return {
    category,
    prices
  };
};

router.get(
  '/:tour_id/:tour_season_id',
  async (req, res) => {
    try {
      res.json(await TourPricingCategoriesController.get_categories(parseInt(req.params.tour_id), [ parseInt(req.params.tour_season_id) ], true));
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.post(
  '/:tour_id/:tour_season_id',
  checkSchema(TourPricingCategoriesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { category, prices } = prepare_category(req, TourPricingCategoriesController.schema());
      const created_category = await TourPricingCategoriesController.create(category, 'tour_pricing_categories');
      if (created_category && req.body.prices) {
        await TourPricingCategoriesController.update_prices(
          prices,
          parseInt(req.params.tour_season_id),
          parseInt(created_category.id),
          'tour_prices',
          'tour_pricing_category_id'
        );
      }

      res.status(201).json(created_category);
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.get(
  '/:tour_id/:tour_season_id/:id',
  async (req, res) => {
    try {
      const category = await TourPricingCategoriesController.get(parseInt(req.params.id));
      if (!category) return h.notFound(res);

      res.json(category);
    } catch (e) {
      return h.error(e, res);
    }
  }
);


router.post(
  '/:tour_id/:tour_season_id/:id',
  checkSchema(TourPricingCategoriesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { category, prices } = prepare_category(req, TourPricingCategoriesController.schema());

      if (category && req.body.prices) {
        await TourPricingCategoriesController.create_prices(
          prices,
          parseInt(req.params.tour_season_id),
          parseInt(category.id),
          'tour_prices',
          'tour_pricing_category_id'
        );
        
        const cat = await TourPricingCategoriesController.get(parseInt(category.id));

        return res.status(201).json(cat);
      } else {
        return h.notFound(res);
      }
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.put(
  '/:tour_id/:tour_season_id/:id',
  checkSchema(TourPricingCategoriesController.schema()),
  async (req, res) => {
    try {
      validationResult(req).throw();
      const { category, prices } = prepare_category(req, TourPricingCategoriesController.schema());
      const updated_category = await TourPricingCategoriesController.update(category);

      if (updated_category && req.body.prices) {
        await TourPricingCategoriesController.update_prices(
          prices,
          parseInt(req.params.tour_season_id),
          parseInt(updated_category.id),
          'tour_prices',
          'tour_pricing_category_id'
        );
      }

      return res.status(201).json(updated_category);
    } catch (e) {
      return h.error(e, res);
    }
  }
);

router.delete(
  '/:tour_id/:tour_season_id/:id',
  async (req, res) => {
    try {
      const category = await TourPricingCategoriesController.get(parseInt(req.params.id));
      if (!category) return h.notFound(res);

      await TourPricingCategoriesController.delete(parseInt(req.params.id));
      res.json({ success: true });
    } catch (e) {
      return h.error(e, res);
    }
  }
);

export default router;
