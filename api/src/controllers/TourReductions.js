import db from '../utils/db';
import Controller from './Controller';
import int from '../schema/int';

class TourReductionsControllers extends Controller {
  static table() { return 'tour_reductions'; }

  static schema() {
    return {
      percent: int('Supply a percentage reduction', false),
      cost: int('Supply a fixed cost', false),
      input_min: int('Supply an input min', false),
      input_max: int('Supply an input max', false),
      input_quantity: int('Supply an input quantity', false),
      output_min: int('Supply an output min', false),
      output_max: int('Supply an output max', false),
      output_quantity: int('Supply an output quantity', false),
      room_type_id: int('Supply a room type id', false),
      deck_id: int('Supply a deck id', false),
      order: int('Supply order', false),
      child_calc_room: int('Supply child calculation room', true),
      child_calc_accommodation: int('Supply child calculation accomodation', true)
    };
  }

  static get_reductions(tour_id, seasons) {
    return db
      .from(this.table())
      .where({ tour_id })
      .whereIn('tour_season_id', seasons)
      .orderBy('order', 'ASC');
  }
}

export default TourReductionsControllers;
