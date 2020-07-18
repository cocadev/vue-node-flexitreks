import db from '../utils/db';
import str from '../schema/string';
import int from '../schema/int';
import date from '../schema/date';
import LinkController from './LinkController';
import array_of_int from '../schema/array_of_int';
import array_of_date from '../schema/array_of_date';
import PriceCalculation from './PriceCalculation';

class TourExtras {
  static party_schema() {
    return {
      name: str('Supply an extra name', false),
      'variations.*.id': int('Supply a variation id', false),
      'variations.*.tour_party_extra_id': int('Supply a extra id', false),
      'variations.*.cost': int('Supply a variation cost'),
      'variations.*.accommodation_category_id': int('Supply an accommodation category id', false),
      'variations.*.bike_id': int('Supply a bike id', false),
      'variations.*.min_pax': int('Supply a min pax', false),
      'variations.*.max_pax': int('Supply a max pax', false),
      'variations.*.order': int('Supply order', false)
    };
  }

  static room_schema() {
    return {
      name: str('Supply an extra name', false),
      pre: { isBoolean: true, optional: true },
      post: { isBoolean: true, optional: true },
      'variations.*.id': int('Supply a variation id', false),
      'variations.*.tour_room_extra_id': int('Supply a extra id', false),
      'variations.*.cost': int('Supply a variation cost'),
      'variations.*.accommodation_category_id': int('Supply an accommodation category id', false),
      'variations.*.room_type_id': int('Supply a room type id', false),
      'variations.*.start': date('Supply a start date', false),
      'variations.*.end': date('Supply a start date', false),
      'variations.*.specific_dates': array_of_date('Supply a list of specific dates'),
      'variations.*.restricted_dates': array_of_date('Supply a list of restricted dates'),
      'variations.*.restricted_days': array_of_int('Supply a list of restricted day numbers')
    };
  }

  static async get_room_extras(tour_id, tour_seasons) {
    return await this.get_extras(
      tour_id,
      tour_seasons,
      'tour_room_extras',
      'tour_room_extra_variations',
      'tour_room_extra_id'
    );
  }

  static async get_party_extras(tour_id, tour_seasons) {
    return await this.get_extras(
      tour_id,
      tour_seasons,
      'tour_party_extras',
      'tour_party_extra_variations',
      'tour_party_extra_id'
    );
  }

  static delete_party_extra(id) {
    return db.transaction(trx => {
      return db('tour_party_extras')
        .where({ id })
        .transacting(trx)
        .del();
    });
  }

  static delete_room_extra(id) {
    return db.transaction(trx => {
      return db('tour_room_extras')
        .where({ id })
        .transacting(trx)
        .del();
    });
  }

  static get_variations_by_ids(ids, table) {
    return db
      .from(table)
      .whereIn('id', ids);
  }

  static get_extras_by_ids(ids, table) {
    return db
      .from(table)
      .whereIn('id', ids);
  }

  /**
   * A generic extras getter for rooms and parties
   * 
   * Get the extras, then all their variations
   * 
   * @param {int}    tour_id 
   * @param {int}    tour_seasons 
   * @param {string} table_one
   * @param {string} table_two 
   * @param {string} id_key
   */
  static async get_extras(tour_id, tour_seasons, table_one, table_two, id_key) {
    if (!Array.isArray(tour_seasons)) tour_seasons = [tour_seasons]
    let query = db
      .select('*')
      .from(table_one)
      .where({ tour_id })
      .whereIn('tour_season_id', tour_seasons);

    if (table_one == 'tour_party_extras') {
      query = query.orderBy('order', 'ASC').orderBy('id');
    } else {
      query = query.orderBy('id');
    }

    const extras = await query;
    
    if (!extras.length) return [];

    extras.map(extra => {
      extra.variations = [];
      return extra;
    });

    // Get variations
    let varaiationsQuery = db
      .select('*')
      .from(table_two)
      .whereIn(id_key, extras.map(e => e.id));

    if (table_two == 'tour_room_extra_variations') {
      varaiationsQuery = varaiationsQuery
        .orderBy('start', 'ASC')
        .orderBy('accommodation_category_id', 'ASC')
        .orderBy('room_type_id', 'ASC')
        .orderBy('id');
    }

    const extraVariations = await varaiationsQuery;

    if (!extraVariations.length) return extras;

    extraVariations.forEach(v => {
      const i = extras.findIndex(e => e.id === v[id_key]);
      if (i !== -1) extras[i].variations.push(v);
    });

    return extras;
  }

  static async create(instance, table) {
    return db.transaction(trx => {
      return trx
        .insert(instance)
        .into(table)
        .returning('*')
        .then(rows => rows[0]);
    });
  }
  
  static async update(instance, table) {
    return db.transaction(trx => {
      return trx
        .where({ id: instance.id })
        .update(instance)
        .into(table)
        .returning('*')
        .then(rows => rows[0]);
    });
  }

  static async create_variations(new_variations, tour_season_id, extra_id, table_two, key) {
    await PriceCalculation.recalculate(new_variations, tour_season_id, 'supplement_markup');

    return LinkController.handle_tour_link_tables(
      extra_id,
      new_variations,
      [],
      'id',
      table_two,
      key
    );
  }
  
  static async update_variations(new_variations, tour_season_id, extra_id, table_two, key) {
    const current = await db
      .select('*')
      .from(table_two)
      .where(key, extra_id);
    
    await PriceCalculation.recalculate(new_variations, tour_season_id, 'supplement_markup');

    return LinkController.handle_tour_link_tables(
      extra_id,
      new_variations,
      current,
      'id',
      table_two,
      key
    );
  }
}

export default TourExtras;
