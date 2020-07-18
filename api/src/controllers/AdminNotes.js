import db from '../utils/db';
import Controller from './Controller';
import content from '../schema/content';

class AdminNotes extends Controller {
  static table () { return 'admin_notes'; }
  static schema () {
    return {
      note: content('Supply a note')
    };
  }

  static getAll() {
    return db
      .select('*')
      .from(this.table())
      .orderBy('createdAt', 'DESC');
  }
}

export default AdminNotes;
