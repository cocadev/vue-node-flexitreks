import LinkController from './LinkController';
import OffersController from './Offers';

class TourOffersController extends LinkController {
  static async handle_links(offer_id, request) {
    const current = await OffersController.get_tours_for_offer(offer_id);
    return super.handle_tour_link_tables(
      offer_id,
      request,
      current,
      'tour_id',
      'tour_offers',
      'offer_id',
      'tour_id'
    );
  }
}

export default TourOffersController;
