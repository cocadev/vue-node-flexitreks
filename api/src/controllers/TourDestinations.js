import db from '../utils/db';
import LinkController from './LinkController';
import DestinationsController from './Destinations';

class TourDestinationsController extends LinkController {
  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await DestinationsController.get_destinations_for_tour(tour_id);
    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'destination_id',
      'tour_destinations'
    );
  }

  static group_tour_destinations() {
    return db('tour_destinations')
      .innerJoin('tours', 'tour_destinations.tour_id', 'tours.id')
      .where({ status: 'live' });
  }
}

export default TourDestinationsController;
