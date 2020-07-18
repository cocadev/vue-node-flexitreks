import db from '../utils/db';
import Controller from './Controller';
import BookingsController from './Bookings';

class BookingSnapshotController extends Controller {
  static table() { return 'booking_snapshots'; }

  static async take_snapshot(booking_id) {
    const booking = await BookingsController.get(booking_id);
    return this.create({
      booking_id,
      snapshot: JSON.stringify(booking)
    });
  }

  static async get_snapshots_for_booking(booking_id) {
    const snapshots = await db(this.table()).where({ booking_id });
    snapshots.forEach(s => s.snapshot = JSON.parse(s.snapshot));
    return snapshots;
  }
}

export default BookingSnapshotController;
