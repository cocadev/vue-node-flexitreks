import db from '../utils/db';
import date from '../schema/date';
import int from '../schema/int';
import float from '../schema/float';
import str from '../schema/string';
import boolean from '../schema/boolean';
import array_of_int from '../schema/array_of_int';
import array_of_date from '../schema/array_of_date';
import Controller from './Controller';
import LinkController from './LinkController';
import TourPricesController from './TourPricing';
import PriceCalculation from './PriceCalculation';

class TourPricingCategoriesController extends Controller {
  static table() { return 'tour_pricing_categories'; }

  static schema() {
    return {
      start: date('Supply a start date', false),
      end: date('Supply a end date', false),
      nights: int('Supply a number of nights', false),
      guided: boolean('Is this tour guided?', false),
      boat_id: int('Supply a boat', false),
      tour_route_id: int('Supply a tour route', false),
      specific_dates: array_of_date('Supply a list of specific dates'),
      restricted_dates: array_of_date('Supply a list of restricted dates'),
      restricted_days: array_of_int('Supply a list of restricted day numbers'),
      'prices.*.cost': int('Supply a cost'),
      'prices.*.id': int('Supply a id', false),
      'prices.*.room_type_id': int('Supply a room type', false),
      'prices.*.accommodation_category_id': int('Supply a accommodation category', false),
      'prices.*.deck_id': int('Supply a deck', false),
      'prices.*.formula': str('Supply a formula', false),
      'prices.*.gross': float('Supply a gross cost', false),
      'prices.*.non_com': int('Supply the non-commissionable amount', false),
      'prices.*.adjustment': int('Supply an adjustment', false),
      'prices.*.markup_rate_id': int('Supply a markup rate', false),

    };
  }

  static async get_categories(tour_id, seasons, admin = false) {
    const categories = await db
      .from(this.table())
      .select(
        'id',
        'start',
        'end',
        'nights',
        'guided',
        'boat_id',
        'tour_route_id',
        'specific_dates',
        'restricted_dates',
        'restricted_days',
        'tour_season_id'
      )
      .where({ tour_id })
      .whereIn('tour_season_id', seasons)
      .orderBy('nights', 'asc')
      .orderBy('boat_id', 'asc')
      .orderBy('tour_route_id', 'asc')
      .orderBy('guided', 'asc')
      .orderBy('start', 'asc');

    if (admin) {
      const prices = await TourPricesController.get_prices(tour_id, seasons);

      categories.forEach(cat => {
        cat.prices = prices.filter(p => p.category === cat.id);
      });
    }

    return categories;
  }

  static get_categories_by_ids(ids) {
    return db
      .from(this.table())
      .whereIn('id', ids);
  }

  static async get(id) {
    const category = await db
      .select('*')
      .from(this.table())
      .where({ id })
      .first();

    if (!category) return null;

    category.prices = await db
      .select('*')
      .from('tour_prices')
      .where({ tour_pricing_category_id: category.id });

    return category;
  }

  static async update_prices(new_prices, tour_season_id, category_id, table_two, key) {
    const current = await db
      .select('*')
      .from(table_two)
      .where(key, category_id);

    await PriceCalculation.recalculate(new_prices, tour_season_id);

    return LinkController.handle_tour_link_tables(
      category_id,
      new_prices,
      current,
      'id',
      table_two,
      key
    );
  }

  static async create_prices(new_prices, tour_season_id, category_id, table_two, key) {
    await PriceCalculation.recalculate(new_prices, tour_season_id);

    return LinkController.handle_tour_link_tables(
      category_id,
      new_prices,
      [],
      'id',
      table_two,
      key
    );
  }
}

export default TourPricingCategoriesController;
