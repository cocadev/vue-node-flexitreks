import db from '../utils/db';
import Controller from './Controller';
import string from '../schema/string';
import email from '../schema/email';

class UsersController extends Controller {
  static schema() {
    return {
      email_address: email(),
      password: string('Please supply a password')
    };
  }

  static getByEmail(email_address) {
    return db(this.table())
      .where({ email_address })
      .first();
  }
}

export default UsersController;
