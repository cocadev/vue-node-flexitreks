import LinkController from './LinkController';
import RegionsController from './Regions';

class TourRegionsController extends LinkController {
  /**
   * Pass the link items off to be created, updated and deleted
   * 
   * @param {int}   tour_id 
   * @param {array} request 
   */
  static async handle_links(tour_id, request) {
    const current = await RegionsController.get_regions_for_tour(tour_id);
    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'region_id',
      'tour_regions'
    );
  }
}

export default TourRegionsController;
