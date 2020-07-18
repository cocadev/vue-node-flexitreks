import db from '../utils/db';
import MediaController from './Media';
import str from '../schema/string';
import content from '../schema/content';
import int from '../schema/int';
import ToursController from './Tours';
import LinkController from './LinkController';

class TourItinerariesController extends LinkController {
  static schema() {
    return {
      '*.title': str('Supply itinerary title', true, false),
      '*.content': content('Supply itinerary content'),
      '*.type': str('Supply itinerary type', false),
      '*.day': int('Supply itinerary day', false),
      '*.media_id': int('Supply itinerary media', false)
    };
  }

  /**
   * List the itineraries for a tour
   * 
   * @param   {int}     tour_id 
   * @param   {string}  type 
   * @param   {bool}    retreive_media 
   * @return  {array}
   */
  static async get_itineraries(tour_id, type = 'public', retreive_media = true) {
    const query = { tour_id };
    if (type) query.type = type;
    const itineraries = await db
      .from('tour_itineraries')
      .select('tour_itineraries.id', 'title', 'content', 'type', 'day', 'media_id')
      .where(query)
      .orderBy('day', 'asc')
      .orderBy('title', 'asc');

    if (retreive_media) {
      const media = itineraries.map(i => i.media_id);
      if (media.length) {
        const images = await MediaController.get_media_by_ids(media);
        if (images.length) {
          itineraries.forEach(i => {
            if (i.media_id) i.media = images.find(image => image.id === i.media_id);
          });
        }
      }
    }

    return itineraries;
  }

  /**
   * Prepare itinerary for update
   * 
   * Check for the tour, then get the current itinerary
   * Pass the itineraries to the LinkController updater
   * 
   * @param   {int}   tour_id 
   * @param   {array} itineraries 
   * @return  {array}
   */
  static async update(tour_id, itineraries) {
    const tour = await ToursController.get_tour_by_id(tour_id);
    if (!tour) throw new Error('This tour does not exist');
    const current = await this.get_itineraries(tour_id, null, false);

    await this.handle_tour_link_tables(tour_id, itineraries, current, 'id', 'tour_itineraries');

    return this.get_itineraries(tour_id, null);
  }
}

export default TourItinerariesController;
