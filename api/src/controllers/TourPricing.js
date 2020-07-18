import db from '../utils/db';

class TourPricesController {
  static get_prices(tour_id, seasons) {
    return db
      .from('tour_prices')
      .select(
        'id',
        'tour_id',
        'tour_pricing_category_id as category',
        'cost',
        'room_type_id',
        'accommodation_category_id',
        'deck_id',
        'tour_season_id',
        'formula',
        'net',
        'gross',
        'non_com',
        'adjustment',
        'markup_rate_id'
      )
      .where({ tour_id })
      .whereIn('tour_season_id', seasons)
      .orderBy('id');
  }

  static get_prices_for_bookings(ids) {
    return db
      .from('tour_prices')
      .whereIn('id', ids)
      .orderBy('id');
  }

  static get_price_by_id(id) {
    return db
      .from('tour_prices')
      .where({ id })
      .first();
  }
}

export default TourPricesController;
