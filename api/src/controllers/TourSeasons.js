import LinkController from './LinkController';
import SeasonsController from './Seasons';
import CurrenciesController from './Currencies';
import PriceCalculation from './PriceCalculation';

class TourSeasonsController extends LinkController {
  static table () { return 'tour_seasons'; }

  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await SeasonsController.get_tour_seasons_for_tour(tour_id);

    await super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'id',
      'tour_seasons'
    );

    request
      .filter(x => x.id)
      .forEach(async (tour_season) => {
        const tour_season_id = tour_season.id;
        const old = current.find(x => x.id === tour_season.id);
        if (!old) return;

        const currencyChanged = old.currency_id !== tour_season.currency_id;
        const modelChanged = old.markup_model_id !== tour_season.markup_model_id ? old.markup_model_id : false;

        if (currencyChanged || modelChanged) {
          const currency = await CurrenciesController.get(tour_season.currency_id);
          const new_rate = currency.rates.find(x => x.season_id === tour_season.season_id);
          if (!new_rate) return;

          await PriceCalculation.update(tour_season_id, 'tour_prices', 'markup', modelChanged);
          await PriceCalculation.update(tour_season_id, 'tour_bikes', 'supplement_markup', modelChanged);
          await PriceCalculation.update_variations(tour_season_id, 'tour_party_extras', 'tour_party_extra_variations', 'tour_party_extra_id', 'supplement_markup', modelChanged);
          await PriceCalculation.update_variations(tour_season_id, 'tour_room_extras', 'tour_room_extra_variations', 'tour_room_extra_id', 'supplement_markup', modelChanged);
        }
      });
  }
}

export default TourSeasonsController;
