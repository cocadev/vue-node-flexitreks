import Thyme from '@trys/thyme';
import db from '../utils/db';
import Controller from './Controller';
import BookingsController from './Bookings';
import ReviewsController from './Reviews';

class TasksController extends Controller {
  static table() { return 'task_details'; }

  static trigger() {
    return async (req, res) => {
      const date = new Thyme().raw;
      const triggered = await db(this.table())
        .where({ date })
        .first();
      
      if (triggered) return res.json({ success: false });

      let details = '';
      const emails = [];

      const [
        six_weeks,
        four_weeks,
        two_weeks,
        day_after
      ] = await Promise.all([
        this.findFutureBookings(42),
        this.findFutureBookings(28),
        this.findFutureBookings(14),
        this.findPostBookings(1)
      ]);

      six_weeks.forEach(b => emails.push({ id: b.id, type: '6weeks' }));
      four_weeks.forEach(b => emails.push({ id: b.id, type: '4weeks' }));
      two_weeks.forEach(b => emails.push({ id: b.id, type: '2weeks' }));
      day_after.forEach(b => emails.push({ id: b.id, type: 'feedback' }));

      try {
        await Promise.all(emails.map(e => BookingsController.send_task_email(e.id, e.type)));
        details += `${emails.length} email${emails.length === 1 ? '' : 's'} sent`;

        const review_count = await ReviewsController.save_reviews();
        details += ` - ${review_count} review${review_count === 1 ? '' : 's'} saved`;

        await this.create({ date, details });
        res.json({ success: true, details });
      } catch(e) {
        return res.json({ success: false });
      }
    };
  }

  static findFutureBookings(days) {
    const start = new Thyme();
    start.add(days);
    return db('bookings')
      .select('id')
      .where({ arrival: start.raw, status: 'payment-completed' });
  }

  static findPostBookings(days) {
    const end = new Thyme();
    end.remove(days);
    return db('bookings')
      .select('id')
      .where({ departure: end.raw, status: 'payment-completed' });
  }
}

export default TasksController;
