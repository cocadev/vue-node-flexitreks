import Controller from './Controller';
import str from '../schema/string';
import int from '../schema/int';
import db from '../utils/db';

class NavigationLinksController extends Controller {
  static table() { 
    return 'navigation_links'; 
  }
  static schema() {
    const schema = super.schema();
    schema.parent_id = str('Supply a parent id');
    schema.column = int('Supply a column');
    schema.title = str('Supply a title');
    schema.url = str('Supply a url');
    schema.position = str('Supply a position', false);
    return schema;
  }
  static async update(body) {
    super.deleteAll()
    const keys = Object.keys(body);
    const promises = keys.map(async(key) => {

      const links1 = body[key].column_1.links;
      const links2 = body[key].column_2.links;
      const links3 = body[key].column_3.links;

      links1.map((link, index)=>{ link["column"] = 1; link["position"] = index })
      links2.map((link, index)=>{ link["column"] = 2; link["position"] = index })
      links3.map((link, index)=>{ link["column"] = 3; link["position"] = index })

      const links = [ ...links1, ...links2, ...links3]
      const meta = await db.from('navigations').where({ parent_category: key });
      links.map((link)=>{
        return this.set_option(meta[0].id, link.title, link.url, link.column, link.position);
      })
    });
    await Promise.all(promises);
  }

  static async set_option(key, title, url, column, position) {
    await super.create({ parent_id: key, title, url, column, position }, 'parent_id');
  }
}

export default NavigationLinksController;