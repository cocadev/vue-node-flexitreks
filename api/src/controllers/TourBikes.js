import LinkController from './LinkController';
import BikesController from './Bikes';
import PriceCalculation from './PriceCalculation';
import array_of_object from '../schema/array_of_object';

class TourBikesController extends LinkController {
  static schema() {
    return {
      bikes: array_of_object('Supply a list of bikes', {
        id: {
          required: false,
          type: Number
        },
        bike_id: {
          required: true,
          type: Number
        },
        cost: {
          required: false,
          type: Number
        },
        nights: {
          required: false,
          type: Number
        },
        boat_id: {
          required: false,
          type: Number
        },
        tour_season_id: {
          required: false,
          type: Number
        },
        gallery_id: {
          required: false,
          type: Number
        },
        formula: {
          required: false,
          type: String
        },
        gross: {
          required: false,
          type: Number
        },
        non_com: {
          required: false,
          type: Number
        },
        adjustment: {
          required: false,
          type: Number
        },
        net: {
          required: false,
          type: Number
        },
        markup_rate_id: {
          required: false,
          type: Number
        },
        order: {
          required: false,
          type: Number
        }
      })
    };
  }

  static async create_bikes(tour_id, tour_season_id, request) {
    request.map(b => {
      if (!b.boat_id) b.boat_id = null;
    });

    await PriceCalculation.recalculate(request, tour_season_id, 'supplement_markup');

    return super.handle_tour_link_tables(
      tour_id,
      request,
      [],
      'id',
      'tour_bikes'
    );
  }

  static async update_bikes(tour_id, tour_season_id, request) {
    const current = await BikesController.get_tour_season_bikes(tour_id, tour_season_id);

    request.map(b => {
      if (!b.boat_id) b.boat_id = null;
    });

    await PriceCalculation.recalculate(request, tour_season_id, 'supplement_markup');

    return super.handle_tour_link_tables(
      tour_id,
      request,
      current,
      'id',
      'tour_bikes'
    );
  }
}

export default TourBikesController;
