import db from '../utils/db';
import juice from 'juice';
import pug from 'pug';
import htmlToText from 'html-to-text';
import aws from '../controllers/Aws';
import Controller from './Controller';

class EmailsController extends Controller {

  static getEmailsForBooking(booking_id) {
    return db(this.table())
      .where({ booking_id })
      .orderBy('createdAt', 'DESC');
  }

  static async getEmailForBooking(type, booking_id) {
    const emails = await this.getEmailsForBooking(booking_id);
    return emails.find(x => x.type === type);
  }


  static generateHTML (filename, options = {}) {
    const html = pug.renderFile(`${__dirname}/../emails/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
  }

  static prepare_email (file, booking, subject) {
    booking.site = process.env.SITE;
    booking.subject = subject;
    const html = this.generateHTML(file, booking);
    const text = htmlToText.fromString(html);

    return { html, text };
  }

  static async send (type, booking, subject) {
    const email = await this.getEmailForBooking(type, booking.id);
    if (email) return { success: false };

    const { html, text } = this.prepare_email(type, booking, subject);

    aws.config.update({ region: 'eu-west-1' });
    const ses = new aws.SES();    

    var options = {
      Destination: {
        ToAddresses: [ process.env.TEST_EMAIL ? process.env.EMAIL : booking.customer.email_address ]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html
          },
          Text: {
            Charset: 'UTF-8',
            Data: text
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      },
      Source: process.env.EMAIL,
    };

    try {
      const result = await ses.sendEmail(options).promise();
      await this.create({
        booking_id: booking.id,
        message_id: result.MessageId,
        status: 'sent',
        type
      });
      return { success: true };
    } catch(e) {
      await this.create({
        booking_id: booking.id,
        status: 'failed',
        details: e.message,
        type
      });
      return { success: false };
    }
  }
}

export default EmailsController;
