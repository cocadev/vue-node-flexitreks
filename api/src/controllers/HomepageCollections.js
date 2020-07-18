import Controller from './Controller';
import db from '../utils/db';

class HomepageCollectionsController extends Controller {
  static table() { 
    return 'homepage_collections'; 
  }
  static async get() {
    const meta = await db.from(this.table());
    if (!meta.length) return {};
    const obj = meta.reduce((c, m) => {
      c[m.key] = m.value;
      return c;
    }, {});
    if (obj.items) {
      obj.items = JSON.parse(obj.items);
      await Promise.all(obj.items.map(async(item, index)=>{
        let media = await db.from('media').where({ id: item.media_id }).first();
        obj.items[index].media = media.url
      }))
    }
    return obj;
  }
  static async update(body) {
    const keys = Object.keys(body);
    const promises = keys.map((key) => {
      const value = key == 'items' ? JSON.stringify(body[key]) : String(body[key]).trim();
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
}

export default HomepageCollectionsController;