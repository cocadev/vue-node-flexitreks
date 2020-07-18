import Controller from './Controller';
import db from '../utils/db';
import int from '../schema/int';
import float from '../schema/float';
import str from '../schema/string';
import MarkupRatesController from './MarkupRates';
import LinkController from './LinkController';
import PriceCalculation from './PriceCalculation';

class MarkupModelsController extends Controller {
  static table() { return 'markup_models'; }

  static schema() {
    return {
      name: str('Supply a name', false),
      season_id: int('Supply a season'),
      'rates.*.id': int('Supply a rate id', false),
      'rates.*.commission': int('Supply a rate commission'),
      'rates.*.markup': float('Supply a rate markup'),
      'rates.*.supplement_markup': float('Supply a rate supplement markup')
    };
  }

  static async get_models_for_season(season_id) {
    const models = await db(this.table())
      .where({ season_id })
      .orderBy('createdAt');
    
    const rates = await MarkupRatesController.get_rates_for_models(models.map(x => x.id));
    models.forEach(model => model.rates = rates.filter(x => x.markup_model_id === model.id));

    return models;
  }

  static async get_errors_rates(ids) {
    return db
      .select('tour_prices.markup_rate_id as id')
      .from('tour_prices')
      .whereIn('tour_prices.markup_rate_id', ids)
      .union([
        db.select('tour_room_extra_variations.markup_rate_id as id')
        .from('tour_room_extra_variations')
        .whereIn('tour_room_extra_variations.markup_rate_id', ids)
      ])
  }

  static async get_model(season_id, id) {
    const model = await db(this.table())
      .where({ season_id, id })
      .first();
    
    if (!model) return null;
    
    model.rates = await MarkupRatesController.get_rates_for_model(model.id);

    return model;
  }

  static async get_model_by_id(id) {
    const model = await super.get(id);
    if (!model) return null;
    
    model.rates = await MarkupRatesController.get_rates_for_model(model.id);

    return model;
  }

  static async create(instance) {
    const rates = instance.rates || [];
    delete instance.rates;
    const response = await super.create(instance);

    rates.forEach(rate => rate.markup_model_id = response.id);
    await this.update_rates(rates, response.id, 'markup_rates', 'markup_model_id');

    return response;
  }

  static async update(instance) {
    const rates = instance.rates || [];
    delete instance.rates;
    const response = await super.update(instance);

    rates.forEach(rate => rate.markup_model_id = response.id);
    await this.update_rates(rates, response.id, 'markup_rates', 'markup_model_id');

    return response;
  }

  static async add_rates(instance) {
    const rates = instance.rates || [];
    delete instance.rates;

    rates.forEach(rate => rate.markup_model_id = instance.id);
    
    await LinkController.handle_tour_link_tables(
      instance.id,
      rates,
      [],
      'id',
      'markup_rates',
      'markup_model_id'
    );
  }

  static async update_rates(new_rates, markup_model_id, rates_table, key) {
    const query = {};
    query[key] = markup_model_id;
    const current = await db(rates_table).where(query);
    
    await LinkController.handle_tour_link_tables(
      markup_model_id,
      new_rates,
      current,
      'id',
      rates_table,
      key
    );
    
    let match = 0;
    new_rates
      .filter(x => x.id)
      .forEach(rate => {
        const old = current.find(x => x.id === rate.id);
        if (!old) return;

        const commissionMatch = old.commission === rate.commission;
        const markupMatch = old.markup === rate.markup;
        const supplementMarkupMatch = old.supplement_markup === rate.supplement_markup;
        if (!commissionMatch || !markupMatch || !supplementMarkupMatch) match++;
      });
    
    if (match) await PriceCalculation.update_where({ markup_model_id });
  }
}

export default MarkupModelsController;
