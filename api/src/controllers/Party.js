import db from '../utils/db';
import BikesController from './Bikes';
import PartyExtrasControllers from './PartyExtras';
import LinkController from './LinkController';

class PartyController extends LinkController {
  static table() {
    return 'party_members';
  }

  /**
   * Gather the party, bikes and party extras for a booking
   * 
   * @param {int} booking_id 
   * @param {int} season 
   * @param {int} tour_id 
   */
  static async get_party_for_booking(booking_id, season = null, tour_id) {
    const party = await db
      .from('party_members')
      .orderBy('id', 'ASC')
      .where({ booking_id });
    
    if (!party) return [];

    const [bikes, extras] = await Promise.all([
      BikesController.get_tour_bikes(tour_id, [season]),
      PartyExtrasControllers.get_extras_for_party(party.map(p => p.id))
    ]);

    party.forEach(person => {
      person.tour_bike = person.tour_bike_id ? bikes.find(bike => bike.id === person.tour_bike_id) : null;

      person.extras = [];
      extras.forEach(extra => {
        if (person.id === extra.party_member_id) person.extras.push(extra);
      });
    });

    return party;
  }

  static async update(booking_id, request) {
    const current = await db
      .from('party_members')
      .orderBy('id', 'ASC')
      .where({ booking_id });

    const party = request.map(person => {
      const newPerson = {
        booking_id,
        title: person.title,
        first_name: person.first_name,
        last_name: person.last_name,
        date_of_birth: person.date_of_birth,
        height: person.height,
        dietary_requirements: person.dietary_requirements,
        tour_bike_id: person.tour_bike_id,
        booking_room_id: person.booking_room_id
      };

      if (person.id) newPerson.id = person.id;
      return newPerson;
    });

    return super.handle_tour_link_tables(
      booking_id,
      party,
      current,
      'id',
      'party_members',
      'booking_id'
    );
  }
}

export default PartyController;
