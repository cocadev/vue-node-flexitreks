import express from 'express';
import h from '../utils/helpers';
import TourSeasonsController from '../controllers/TourSeasons';
import CurrenciesController from '../controllers/Currencies';
import MarkupModelsController from '../controllers/MarkupModels';
const router = express.Router();

async function get_currency(season) {
  if (!season.currency_id) return null;

  const currency = await CurrenciesController.get(season.currency_id);
  if (!currency) return null;
      
  const rate = currency.rates.find(x => x.season_id === season.season_id);
  if (!rate) return null;
  currency.rate = rate.rate;
  delete currency.rates;

  return currency;
}

router.get(
  '/:tour_id/:tour_season_id',
  async (req, res) => {
    try {
      const tour_id = parseInt(req.params.tour_id);
      const tour_season_id = parseInt(req.params.tour_season_id);
      const season = await TourSeasonsController.get(tour_season_id);
      if (!season || season.tour_id !== tour_id) return h.notFound(res);

      season.currency = await get_currency(season);
      season.model = season.markup_model_id ? await MarkupModelsController.get_model(season.season_id, season.markup_model_id) : null;

      res.json(season);
    } catch (e) {
      return h.error(e, res);
    }
  }
);

export default router;
