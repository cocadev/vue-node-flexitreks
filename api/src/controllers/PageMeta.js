import db from '../utils/db';
import LinkController from './LinkController';
import MediaController from './Media';

class PageMeta extends LinkController {
  static table () { return 'page_meta'; }

  static async get(page_id) {
    const meta = await db.from('page_meta').where({ page_id });

    if (!meta.length) return {};
    const formatted = meta.reduce((c, m) => {
      c[m.key] = JSON.parse(m.value);
      if (m.key === 'inspiration' && Array.isArray(c[m.key])) {
        c[m.key].sort((a, b) => Number(a.order) - Number(b.order));
      }
      return c;
    }, {});

    if (formatted.inspiration) {
      await MediaController.resolve_media(formatted.inspiration);
    }

    return formatted;
  }

  static async update(page_id, body) {
    const keys = Object.keys(body);
    const promises = keys.map((key) => {
      const value = JSON.stringify(body[key]);
      return this.set_option(page_id, key, value);
    });

    await Promise.all(promises);
  }

  static async set_option(page_id, key, value) {
    const current = await this.get_raw(page_id, key);
    if (current) {
      await super.update({
        id: current.id,
        page_id,
        key,
        value
      });
    } else {
      await super.create({
        page_id,
        key,
        value
      });
    }
  }

  static get_raw(page_id, key) {
    return db.from(this.table())
      .where({ page_id, key })
      .first();
  }
}

export default PageMeta;
