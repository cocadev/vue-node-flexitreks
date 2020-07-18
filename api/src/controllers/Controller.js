import db from '../utils/db';
import name from '../schema/name';

class Controller {
  /**
   * Guess the table name from the controller
   */
  static table() {
    return this.name.replace('Controller', '').toLowerCase();
  }

  static async count(search) {
    let query = db(this.table());
    if (search && Object.keys(search).length) {
      let key = Object.keys(search)[0];
      let string = '%' + search[key] + '%';
      query = query
        .where(key, 'ilike', string);
    }
    query = query.count('id');
    return await query
  }

  /**
   * List all
   */
  static async getAll(settings) {
    let query = db.select('*')
    if (settings && settings.order) query = query.orderBy(settings.order, settings.order_dir || 'ASC')
    query = query.from(this.table());
    return await query
  }

  static async getPage(page = 1, perPage = 15) {
    return await db
      .select('*')
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset((page - 1) * perPage)
      .from(this.table());
  }

  /**
   * Get by id
   * 
   * @param {int} id 
   */
  static async get(id) {
    return await db
      .select('*')
      .from(this.table())
      .where({ id })
      .first();
  }

  /**
   * Get by slug
   * 
   * @param {int} slug 
   */
  static async get_by_slug(slug) {
    return await db
      .select('*')
      .from(this.table())
      .where({ slug })
      .first();
  }

  /**
   * Get by ids
   * 
   * @param {int} id 
   */
  static async get_by_ids(ids) {
    return await db
      .select('*')
      .from(this.table())
      .whereIn('id', ids);
  }

  /**
   * Create
   * 
   * @param {object} instance 
   */
  static async create(instance) {
    return db.transaction(trx => {
      return trx
        .insert(instance)
        .into(this.table())
        .returning('*')
        .then(rows => rows[0]);
    });
  }

  /**
   * Update
   * 
   * @param {object} instance 
   */
  static async update(instance, key = 'id') {
    const query = {};
    query[key] = instance[key];
    return db.transaction(trx => {
      return trx
        .where(query)
        .update(instance)
        .into(this.table())
        .returning('*')
        .then(rows => rows[0]);
    });
  }

  /**
   * Get relatives
   * 
   * @param {object} relation 
   */
  static async get_rels(id, relation) {
    let field = relation.tables[0] + '.' + relation.field;
    let query = db
      .select((field + ' as id'))
      .from(relation.tables[0])
      .where(field, id);
    let other_tables = relation.tables.slice(1, relation.tables.length);
    if (other_tables.length > 0) {
      other_tables.map(table => {
        let field_table = table + '.' + relation.field;
        query = query.union([
          db.select(field_table + ' as id')
          .from(table)
          .where(field_table, id)
        ]);
      })
    }
    return await query;
  }

  /**
   * Delete
   * 
   * @param {object} value 
   */
  static async delete(value, key = 'id') {
    const query = {};
    query[key] = value;
    return db.transaction(trx => {
      return db(this.table())
        .where(query)
        .transacting(trx)
        .del();
    });

  }

  /**
   * Delete All
   * 
   * @param {object} value 
   */
  static async deleteAll() {
    return db.transaction(trx => {
      return db(this.table())
        .transacting(trx)
        .del();
    });

  }

  /**
   * Default schema
   */
  static schema() {
    return {
      name
    };
  }
}

export default Controller;
