import db from '../utils/db';
import TourSeasonsController from './TourSeasons';
import CurrenciesController from './Currencies';
import MarkupModelsController from './MarkupModels';

class PriceCalculation {
  /**
   * Recalculate net & cost prices with the latest markup and currencies
   * 
   * @param {array} prices
   * @param {int}   tour_season_id 
   */
  static async recalculate(prices, tour_season_id, type = 'markup', old_model_id = null) {
    if (!prices.length) return;

    const tour_season = await TourSeasonsController.get(tour_season_id);
    if (!tour_season || !tour_season.currency_id || !tour_season.markup_model_id) return;

    const currency = await CurrenciesController.get(tour_season.currency_id);
    if (!currency || !currency.rates.find(c => c.season_id === tour_season.season_id)) return;

    const markup = await MarkupModelsController.get_model(tour_season.season_id, tour_season.markup_model_id);
    if (!markup) return;

    let old_model = old_model_id ? await MarkupModelsController.get_model(tour_season.season_id, old_model_id) : null;

    const exchange = currency.rates.find(c => c.season_id === tour_season.season_id);

    prices.forEach(price => {
      price.formula = price.formula || null;
      price.gross = price.gross || 0;
      price.non_com = price.non_com || 0;
      price.adjustment = price.adjustment || 0;

      let rate = markup.rates.find(x => x.id === price.markup_rate_id);
      if (!rate) {
        if (old_model) {
          const old_rate = old_model.rates.find(r => r.id === price.markup_rate_id);
          if (old_rate) {
            const new_rate = markup.rates.find(r => r.commission === old_rate.commission);
            if (new_rate) {
              rate = new_rate;
              price.markup_rate_id = rate.id;
            }
          }
        }

        if (!rate) {
          const zero = markup.rates.find(x => x.commission === 0);
          if (!zero) return;
          rate = zero;
          price.markup_rate_id = rate.id;
        }
      }

      const net = ((price.gross - price.non_com) - ((price.gross - price.non_com) * rate.commission / 100) + price.non_com);
      price.net = isNaN(net) || net <= price.non_com ? 0 : net;

      const subtotal = rate ? (Math.ceil(price.net / exchange.rate * rate[type]) || 0) : 0;
      price.cost = subtotal + price.adjustment || 0;
    });
  }

  static obscure(prices) {
    return prices.forEach(p => {
      if (p.variations) return this.obscure(p.variations);

      delete p.formula;
      delete p.net;
      delete p.gross;
      delete p.non_com;
      delete p.adjustment;
      delete p.markup_rate_id;
    });
  }

  static async update(tour_season_id, table, type, old_model_id) {
    const prices = await db(table).where({ tour_season_id });
    await PriceCalculation.recalculate(prices, tour_season_id, type, old_model_id);

    await db.transaction(async (trx) => {
      const updating = prices.map(instance => {
        const query = { id: instance.id };
        return db.update(instance)
          .where(query)
          .transacting(trx)
          .into(table);
      });

      try {
        return Promise.all(updating);
      } catch (e) {
        trx.rollback();
      }
    });
  }

  static async update_where(query) {
    const tour_seasons = await db('tour_seasons').select('id').where(query);
    if (!tour_seasons.length) return;
    console.log(tour_seasons.map(x => x.id));

    const actions = [];
    tour_seasons.forEach(tour_season => {
      actions.push(PriceCalculation.update(tour_season.id, 'tour_prices', 'markup', false));
      actions.push(PriceCalculation.update(tour_season.id, 'tour_bikes', 'supplement_markup', false));
      actions.push(PriceCalculation.update_variations(tour_season.id, 'tour_party_extras', 'tour_party_extra_variations', 'tour_party_extra_id', 'supplement_markup', false));
      actions.push(PriceCalculation.update_variations(tour_season.id, 'tour_room_extras', 'tour_room_extra_variations', 'tour_room_extra_id', 'supplement_markup', false));
    });
    
    await Promise.all(actions);
  }

  static async update_variations(tour_season_id, extra_table, variation_table, key, type, old_model_id) {
    const extras = await db(extra_table).where({ tour_season_id });
    const ids = extras.map(x => x.id);

    const prices = await db(variation_table).whereIn(key, ids);
    await PriceCalculation.recalculate(prices, tour_season_id, type, old_model_id);

    await db.transaction(async (trx) => {
      const updating = prices.map(instance => {
        const query = { id: instance.id };
        return db.update(instance)
          .where(query)
          .transacting(trx)
          .into(variation_table);
      });

      try {
        return Promise.all(updating);
      } catch (e) {
        trx.rollback();
      }
    });
  }
}

export default PriceCalculation;
