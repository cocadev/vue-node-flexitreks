import db from '../utils/db';
import Controller from './Controller';

class LinkController extends Controller {
  /**
   * Update tour link tables
   * 
   * @param {int}    shared_value  Most likely a tour_id
   * @param {object} request        The POST/PUT request
   * @param {array}  current        All current instances of this type
   * @param {string} secondary_key  The key that when combined with shared_key/value, becomes unique
   * @param {string} table          The table to be updated
   * @param {string} shared_key    The primary key
   */
  static async handle_tour_link_tables(shared_value, request, current, secondary_key, table, shared_key = 'tour_id', id_key = 'id') {
    if (shared_key !== null) request.map(r => r[shared_key] = shared_value);
    const ids = current.map(h => h[id_key]);

    let toAdd = [];
    let toUpdate = [];
    let toDelete = [];

    if (secondary_key === 'id') {
      toAdd = request.filter(h => h.id === undefined);
      toUpdate = request.filter(h => ids.includes(h.id));
      toDelete = ids.filter(h => !request.find(i => i.id === h));
    } else {
      toAdd = request.filter(h => !ids.includes(h[secondary_key]));
      toUpdate = request.filter(h => ids.includes(h[secondary_key]));
      toDelete = ids.filter(h => !request.find(i => i[secondary_key] === h));
    }

    // console.log('---')
    // console.log(toAdd)
    // console.log('---')
    // console.log(toUpdate)
    // console.log('---')
    // console.log(toDelete)
    // console.log('---')
    // return

    await db.transaction(async (trx) => {
      const adding = toAdd.map(instance => {
        return db.insert(instance)
          .transacting(trx)
          .into(table);
      });

      const updating = toUpdate.map(instance => {
        const query = {};
        if (shared_key !== null) query[shared_key] = shared_value;
        query[secondary_key] = instance[secondary_key];
        return db.update(instance)
          .where(query)
          .transacting(trx)
          .into(table);
      });

      const deleting = toDelete.map(id => {
        const query = {};
        if (shared_key !== null) query[shared_key] = shared_value;
        query[secondary_key] = id;
        return db(table)
          .where(query)
          .transacting(trx)
          .del();
      });

      try {
        return Promise.all(adding.concat(updating).concat(deleting));
      } catch (e) {
        trx.rollback();
      }
    });
  }
}

export default LinkController;
