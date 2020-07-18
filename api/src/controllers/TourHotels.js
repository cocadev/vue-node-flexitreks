import LinkController from './LinkController';
import HotelsController from './Hotels';

class TourHotelsController extends LinkController {
  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await HotelsController.get_hotels_for_tour(tour_id);
    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'hotel_id',
      'tour_hotels'
    );
  }
}

export default TourHotelsController;
