import LinkController from './LinkController';
import RestaurantsController from './Restaurants';

class TourRestaurantsController extends LinkController {
  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await RestaurantsController.get_restaurants_for_tour(tour_id);
    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'restaurant_id',
      'tour_restaurants'
    );
  }
}

export default TourRestaurantsController;
