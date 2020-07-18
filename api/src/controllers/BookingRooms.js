import db from '../utils/db';
import TourPricesController from './TourPricing';
import BookingExtrasController from './BookingExtras';
import AccommodationController from './AccommodationCategories';
import RoomTypesController from './RoomTypes';
import LinkController from './LinkController';

class BookingRoomsControllers extends LinkController {
  static table () {
    return 'booking_rooms';
  }

  /**
   * Get the rooms for a booking
   * Then fill in the prices, extras and types
   * 
   * @param {int} booking_id 
   */
  static async get_rooms_for_booking(booking_id) {
    const rooms = await db
      .select('id', 'tour_price_id', 'cost', 'net')
      .from('booking_rooms')
      .where({ booking_id });
    
    if (!rooms) return [];

    const [prices, extras, room_types, accommodation] = await Promise.all([
      TourPricesController.get_prices_for_bookings(rooms.map(r => r.tour_price_id)),
      BookingExtrasController.get_extras_for_room(rooms.map(r => r.id)),
      RoomTypesController.getAll(),
      AccommodationController.getAll()
    ]);

    rooms.forEach(room => {
      prices.forEach(price => {
        if (room.tour_price_id === price.id) {
          const r = room_types.find(r => r.id === price.room_type_id);
          const a = accommodation.find(a => a.id === price.accommodation_category_id);

          if (r) room.name = r.name;
          if (r) room.sleeps = r.sleeps;
          if (a) room.category = a.name;

          room.tour_price = price;
        }
      });
      
      room.extras = [];
      extras.forEach(extra => {
        if (room.id === extra.booking_room_id) {
          if (extra.variation && extra.variation.room_type_id) {
            const r = room_types.find(r => r.id === extra.variation.room_type_id);
            const a = accommodation.find(a => a.id === extra.variation.accommodation_category_id);

            if (r) extra.variation.name = r.name;
            if (r) extra.variation.sleeps = r.sleeps;
            if (a) extra.variation.category = a.name;
          }
          room.extras.push(extra);
        }
      });
    });

    return rooms;
  }

  static async update(booking_id, request) {
    const current = await this.get_rooms_for_booking(booking_id);

    const rooms = request.map(room => {
      const newRoom = {
        booking_id,
        tour_price_id: room.tour_price_id,
        cost: room.cost,
        net: room.net
      };
      
      if (room.id) newRoom.id = room.id;
      return newRoom;
    });

    return super.handle_tour_link_tables(
      booking_id,
      rooms,
      current,
      'id',
      'booking_rooms',
      'booking_id'
    );
  }
}

export default BookingRoomsControllers;
