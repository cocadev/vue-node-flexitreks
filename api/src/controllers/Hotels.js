import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';

class HotelsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.content = content();
    return schema;
  }

  static get_hotels_for_tour(tour_id) {
    return db
      .from('hotels')
      .innerJoin('tour_hotels', 'hotels.id', 'tour_hotels.hotel_id')
      .where({ 'tour_id': tour_id })
      .orderBy('order')
      .select('hotels.id', 'name', 'content');
  }
}

export default HotelsController;
