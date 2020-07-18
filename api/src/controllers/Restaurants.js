import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';

class RestaurantsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.content = content();
    return schema;
  }

  static get_restaurants_for_tour(tour_id) {
    return db
      .from('restaurants')
      .innerJoin('tour_restaurants', 'restaurants.id', 'tour_restaurants.restaurant_id')
      .where({ 'tour_id': tour_id })
      .select('restaurants.id', 'name', 'content');
  }
}

export default RestaurantsController;
