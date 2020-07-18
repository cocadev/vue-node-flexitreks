import Controller from './Controller';
import email from '../schema/email';
import str from '../schema/string';
import fetch from 'node-fetch';

class NewsletterController extends Controller {
  static schema() {
    return {
      first_name: str('Please supply your first name'),
      last_name: str('Please supply your last name'),
      email_address: email('Please supply your email')
    };
  }

  static create(body) {
    return fetch(`https://us7.api.mailchimp.com/3.0/lists/${process.env.MC_LIST}/members/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'apikey ' + process.env.MC_API
      }
    })
    .then(response => response.json());
  }
}

export default NewsletterController;
