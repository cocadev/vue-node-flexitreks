import { validationResult } from 'express-validator/check';
import querystring from 'querystring';
import fetch from 'node-fetch';
import BookingsController from './Bookings';
import db from '../utils/db';
import Controller from './Controller';
import h from '../utils/helpers';
import int from '../schema/int';
import str from '../schema/string';
import EmailsController from './Emails';

class PaymentsController extends Controller {
  static table() { return 'payments'; }

  static sagepay_url() {
    return `https://${process.env.SAGEPAY_LIVE === 'true' ? 'live' : 'test'}.sagepay.com/gateway/service/vspserver-register.vsp?`;
  }

  static schema() {
    return {
      booking_reference: str('Supply a booking reference', true, false),
      amount: {
        errorMessage: 'Supply an amount',
        isFloat: {
          options: {
            min: 1
          }
        },
        toFloat: true,
        optional: false
      },
      comment: str('Supply a payment comment', false)
    };
  }

  static private_schema() {
    return {
      booking_id: int('Supply a booking ID'),
      amount: {
        errorMessage: 'Supply an amount',
        isFloat: {
          options: {
            min: 1
          }
        },
        toFloat: true,
        optional: false
      },
      sagepay_reference: str('Supply a sagepay reference', false),
      status: str('Supply a payment status'),
      tx_code: str('Supply a transaction reference', false),
      comment: str('Supply a payment comment', false)
    };
  }

  static getAll() {
    return db(this.table())
      .orderBy('createdAt', 'DESC');
  }

  static get_payment_by_sagepay_reference(sagepay_reference) {
    return db(this.table())
      .where({ sagepay_reference })
      .first();
  }

  static get_payments_for_booking(booking_id) {
    return db(this.table())
      .where({ booking_id })
      .orderBy('createdAt', 'ASC');
  }

  static get_booking_for_payment({ booking_id }) {
    return BookingsController.get_booking_by_id(booking_id);
  }

  static sum_payments(payments) {
    return payments
      .filter(x => x.status === 'completed')
      .map(x => Number(x.amount))
      .reduce((c, x) => c + x, 0);
  }

  static async create(instance) {
    const booking = await BookingsController.get(instance.booking_id);
    if (!booking) throw new Error('Booking not found');

    if (!instance.tx_code) {
      const payments = await this.get_payments_for_booking(booking.id);
      instance.tx_code =  'Booking.' + booking.booking_reference.replace('/', '_') + '.Payment.' + (payments.length + 1);
    }

    return super.create(instance);
  }

  static create_request() {
    return async (req, res) => {
      try {
        validationResult(req).throw();
        const booking = await BookingsController.get_booking_by_reference(req.body.booking_reference);
        if (!booking) throw new Error('Booking not found');
        return await this.create_payment({
          booking_id: booking.id,
          amount: req.body.amount,
          tx_type: 'PAYMENT',
          comment: req.body.comment
        }, res);
      } catch (e) {
        return h.error(e, res);
      }
    };
  }

  static async create_payment(payload, res) {
    const { booking_id, amount, tx_type, comment } = payload;

    const booking = await BookingsController.get(booking_id);
    if (!booking) throw new Error('Booking not found');

    const payments = await this.get_payments_for_booking(booking.id);
    const current_total = this.sum_payments(payments);

    if (current_total >= booking.total_cost) throw new Error('This booking has been paid for');

    const tx_code = 'Booking.' + booking.booking_reference.replace('/', '_') + '.Payment.' + (payments.length + 1);
    const payment = this.prepare_payment(Number(amount).toFixed(2), booking, tx_code, tx_type);

    try {
      const data = await this.make_payment_request(payment);

      await super.create({
        booking_id: booking.id,
        amount: payment.Amount,
        status: 'pending',
        tx_code: payment.VendorTxCode,
        sagepay_reference: data.VPSTxId,
        comment
      });

      res.json({
        status: data.Status,
        url: data.NextURL
      });
    } catch (e) {
      return h.error(e, res);
    }
  }

  static make_payment_request(payment) {
    return fetch(this.sagepay_url() + querystring.stringify(payment), { method: 'POST' })
      .then(response => response.text())
      .then(h.extract_sagepay_route);
  }

  static prepare_payment(amount, booking, VendorTxCode, TxType) {
    const payment = {
      VPSProtocol: '3.00',
      TxType,
      Vendor: 'flexitreks',
      VendorTxCode,

      Amount: amount,
      Currency: 'GBP',
      Description: booking.tour.name,

      NotificationURL: process.env.SAGEPAY_NOTIFICATION,

      BillingSurname: booking.customer.last_name,
      BillingFirstnames: booking.customer.first_name,
      BillingAddress1: booking.customer.address_line_1,
      BillingAddress2: booking.customer.address_line_2 || '',
      BillingCity: booking.customer.town,
      BillingPostCode: booking.customer.postcode,
      BillingCountry: booking.customer.country,
      BillingPhone: booking.customer.telephone_number,

      DeliverySurname: booking.customer.last_name,
      DeliveryFirstnames: booking.customer.first_name,
      DeliveryAddress1: booking.customer.address_line_1,
      DeliveryAddress2: booking.customer.address_line_2 || '',
      DeliveryCity: booking.customer.town,
      DeliveryPostCode: booking.customer.postcode,
      DeliveryCountry: booking.customer.country,
      CustomerEMail: booking.customer.email_address,

      ApplyAVSCV2: 1
    };

    return payment;
  }

  static payment_response() {
    return async (req, res) => {
      const data = h.extract_sagepay_request(req.body);
      const status = data.Status;

      const payment = await this.get_payment_by_sagepay_reference(data.VPSTxId);
      if (!payment) return this.response(res, 'ERROR', false, false);

      const booking = await this.get_booking_for_payment(payment);
      const is_booking = booking.status === 'pending';

      await this.update_payment_status(payment, status);

      const query = is_booking ? '?booking_reference=' + booking.uuid : '';
      let sagepay_status = 'OK';
      let is_successful = true;

      if (status === 'ABORT') {
        is_successful = false;
      } else if (status !== 'OK') {
        sagepay_status = 'ERROR';
        is_successful = false;
      }

      if (status === 'OK') {
        await this.calculate_totals(booking);

        if (is_booking) {
          await BookingsController.send_confirmation_email(booking.id);
        } else {
          await this.send_confirmation_email(booking.id);
        }
      }

      return this.response(res, sagepay_status, is_booking, is_successful, query);
    };
  }

  static response(res, sagepay_status, booking, success, query = '') {
    const site = process.env.SITE;
    const route = booking ? '/booking/' : '/payments/';
    const path = success ? 'success' : 'failure';

    return res.send([
      'Status=' + sagepay_status,
      'RedirectURL=' + site + route + path + query
    ].join('\n'));
  }

  static async calculate_totals (booking) {
    if (!booking) return;
    try {
      const payments = await this.get_payments_for_booking(booking.id);
      const total = this.sum_payments(payments);
      booking.status = total >= booking.total_cost ? 'payment-completed' : 'payment-started';
      await BookingsController.update(booking);
    } catch (e) {
      return;
    }
  }

  static update_payment_status(payment, response_status) {
    const status = {
      'OK': 'completed',
      'ABORT': 'aborted'
    }[response_status] || 'failed';

    payment.status = status;
    return super.update(payment);
  }

  static async send_confirmation_email(id) {
    const booking = await BookingsController.get(id);
    await EmailsController.send('payment', booking, 'Thank you for your payment');
  }
}

export default PaymentsController;
