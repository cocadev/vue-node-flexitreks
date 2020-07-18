import db from '../utils/db';
import Controller from './Controller';
import array_of_object from '../schema/array_of_object';

class TourWeatherController extends Controller {
  static table() { return 'tour_weather'; }

  static schema() {
    return {
      weather: array_of_object('Supply the weather', {
        month: {
          required: true,
          type: Number
        },
        temperature: {
          required: true,
          type: Number
        },
        rainfall: {
          required: false,
          type: Number
        }
      })
    };
  }

  static get(tour_id) {
    return db
      .select('month', 'temperature', 'rainfall')
      .from(this.table())
      .where({ tour_id })
      .orderBy('month', 'ASC');
  }

  static create_or_update(weather, current) {
    const match = current.find(w => w.month === weather.month);
    if (!match) return this.create(weather);
    else return db.transaction(trx => {
      return trx
        .where({
          tour_id: weather.tour_id,
          month: weather.month
        })
        .update(weather)
        .into(this.table())
        .returning('*')
        .then(rows => rows[0]);
    });
  }
}

export default TourWeatherController;
