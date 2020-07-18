import Controller from './Controller';
import str from '../schema/string';
import db from '../utils/db';

class NavigationsController extends Controller {
  static schema() {
    const schema = super.schema();
    schema.parent_category = str('Supply a parent category');
    schema.column_1_title = str('Supply a column 1 title');
    schema.column_2_title = str('Supply a column 2 title');
    schema.column_3_title = str('Supply a column 3 title');
    return schema;
  }
  static async getAll() {
    const columns = ['column_1', 'column_2', 'column_3']
    const data = await db.from('navigations');
    const links = await db.from('navigation_links');

    let navigations = []
    data.map(item=>{ navigations.push({
      parent_category: item.parent_category,
      id: item.id
    }) })

    let result = {}
    navigations.map((n, key)=>{ 
      result[n.parent_category] = {}
      columns.map((c, index)=> { 
        result[n.parent_category][c] = {}
        result[n.parent_category][c]['title'] = data[key][c + "_title"]
        result[n.parent_category][c]['links'] = Filter(links, n.id, (index+1).toString())
      })
    })
    return result;
  }
  static async update(body) {
    const keys = Object.keys(body);
    const promises = keys.map((key) => {
      const column_1_title = body[key].column_1.title;
      const column_2_title = body[key].column_2.title;
      const column_3_title = body[key].column_3.title;
      return this.set_option(key, column_1_title, column_2_title, column_3_title);
    });
    await Promise.all(promises);
  }

  static async set_option(key, column_1_title, column_2_title, column_3_title) {
    await super.update({
      parent_category: key, column_1_title, column_2_title, column_3_title
    }, 'parent_category');
  }
}

export default NavigationsController;

function Filter (lists, parent_id, column){
  let result = lists.filter(d => d.parent_id === parent_id && d.column === column).map(item=>{
    let data = {}
    data["title"] = item.title
    data["url"] = item.url
    data["position"] = item.position
    return data
  })
  return result.sort(function(a, b){
    return parseInt(a.position) - parseInt(b.position);
  });
}
