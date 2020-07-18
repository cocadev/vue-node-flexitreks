import db from '../utils/db';
import TourExtras from './TourExtras';
import LinkController from './LinkController';

class PartyExtrasControllers extends LinkController {
  /**
   * Get the extras for a party
   * 
   * @param {int} ids 
   */
  static async get_extras_for_party(ids) {
    const extras = await db
      .from('party_member_extras')
      .whereIn('party_member_id', ids);

    const variations = await TourExtras.get_variations_by_ids(extras.map(e => e.tour_party_extra_variation_id), 'tour_party_extra_variations');
    const variation_parents = await TourExtras.get_extras_by_ids(variations.map(v => v.tour_party_extra_id), 'tour_party_extras');

    extras.forEach(extra => {
      variations.forEach(variation => {
        if (variation.id === extra.tour_party_extra_variation_id) {
          variation_parents.forEach(parent => {
            if (parent.id === variation.tour_party_extra_id) extra.name = parent.name;
          });

          extra.variation = variation;
        }
      });
    });

    return extras;
  }

  static async update(people) {
    const current = await this.get_extras_for_party(people.map(p => p.id));
    const extras = [];

    people.forEach(person => {
      if (person.extras) {
        person.extras.forEach(extra => {
          extras.push({
            party_member_id: person.id,
            tour_party_extra_variation_id: extra.tour_party_extra_variation_id,
            cost: extra.cost,
            net: extra.net,
            id: extra.id
          });
        });
      }
    });

    return super.handle_tour_link_tables(
      null,
      extras,
      current,
      'id',
      'party_member_extras',
      null
    );
  }
}

export default PartyExtrasControllers;
