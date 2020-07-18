import db from '../utils/db';
import TourExtras from './TourExtras';
import LinkController from './LinkController';
import RoomTypesController from './RoomTypes';
import AccommodationCategoriesController from './AccommodationCategories';

class BookingExtrasController extends LinkController {
  /**
   * Get the extras for a booking room
   * 
   * @param {array} ids array of booking rooms
   */
  static async get_extras_for_room(ids) {
    const extras = await db
      .from('booking_room_extras')
      .whereIn('booking_room_id', ids);
    
    const tourExtras = await TourExtras.get_extras_by_ids(extras.map(v => v.tour_room_extra_id), 'tour_room_extras');
    const rooms = await RoomTypesController.getAll();
    const accommodation = await AccommodationCategoriesController.getAll();

    extras.forEach(extra => {
      const tourExtra = tourExtras.find(e => e.id === extra.tour_room_extra_id);
      if (tourExtra) {
        extra.name = tourExtra.name;
        if (extra.room_type_id) extra.room_name = rooms.find(x => x.id === extra.room_type_id).name;
        if (extra.accommodation_category_id) extra.category = accommodation.find(x => x.id === extra.accommodation_category_id).name;
      }
    });

    return extras;
  }

  static async update(rooms) {
    const current = await this.get_extras_for_room(rooms.map(p => p.id));
    const extras = [];

    rooms.forEach(room => {
      if (room.extras) {
        room.extras.forEach(extra => {
          if (extra.name) delete extra.name;
          if (extra.room_name) delete extra.room_name;
          if (extra.category) delete extra.category;
          
          extra.booking_room_id = room.id;
          extras.push(extra);
        });
      }
    });

    return super.handle_tour_link_tables(
      null,
      extras,
      current,
      'id',
      'booking_room_extras',
      null
    );
  }
}

export default BookingExtrasController;
