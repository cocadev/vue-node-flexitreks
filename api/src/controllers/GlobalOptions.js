import db from '../utils/db';
import LinkController from './LinkController';
import ReviewsController from './Reviews';

class GlobalOptions extends LinkController {
  static table() { return 'options'; }

  static async get() {
    const meta = await db.from(this.table());

    if (!meta.length) return {};
    const obj = meta.reduce((c, m) => {
      c[m.key] = m.value;
      return c;
    }, {});

    if (obj.featured_reviews) {
      const ids = obj.featured_reviews.split(',');
      obj.reviews = await ReviewsController.get_by_ids(ids);
    }

    if (obj.popular_searches) obj.popular_searches = JSON.parse(obj.popular_searches);

    return obj;
  }

  static async update(body) {
    const keys = Object.keys(body);
    const promises = keys.map((key) => {
      const value = String(body[key]).trim();
      return this.set_option(key, value);
    });
    
    await Promise.all(promises);
  }

  static async set_option(key, value) {
    const current = await this.get_raw(key);
    if (current) {
      await super.update({
        key,
        value
      }, 'key');
    } else {
      await super.create({
        key,
        value
      });
    }
  }
  
  static get_raw(key) {
    return db.from(this.table())
      .where({ key })
      .first();
  }

  static async get_option(key) {
    const result = await db.from(this.table())
      .where({ key })
      .first();
    
    return result ? result.value : null;
  }
}

export default GlobalOptions;
