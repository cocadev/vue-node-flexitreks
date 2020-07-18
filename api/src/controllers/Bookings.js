import Thyme from '@trys/thyme';
import uuid from 'uuidv4';
import db from '../utils/db';
import CustomersController from './Customers';
import ToursController from './Tours';
import OperatorsController from './Operators';
import TourItinerariesController from './TourItineraries';
import TourDocumentationController from './Documentation';
import HotelsController from './Hotels';
import DestinationsController from './Destinations';
import RestaurantsController from './Restaurants';
import TourMetaController from './TourMeta';
import SeasonsControllers from './Seasons';
import BookingRoomsController from './BookingRooms';
import PartyController from './Party';
import Controller from './Controller';
import { validationResult } from 'express-validator/check';
import h from '../utils/helpers';
import int from '../schema/int';
import str from '../schema/string';
import date from '../schema/date';
import email from '../schema/email';
import tel from '../schema/tel';
import postcode from '../schema/postcode';
import TourPricesController from './TourPricing';
import TourPricingCategoriesController from './TourPricingCategories';
import RoomTypesController from './RoomTypes';
import BikesController from './Bikes';
import TourExtras from './TourExtras';
import TourReductionsControllers from './TourReductions';
import { AgeAtDate } from '../utils/age';
import PartyExtrasControllers from './PartyExtras';
import BookingExtrasController from './BookingExtras';
import PaymentsController from './Payments';
import OffersController from './Offers';
import EmailsController from './Emails';
import MediaController from './Media';
import BookingSnapshotController from './BookingSnapshots';
import TourSeasonsController from './TourSeasons';
import CurrenciesController from './Currencies';

class BookingsController extends Controller {
  static schema() {
    return {
      tour_id: int('Supply a tour id'),
      tour_season_id: int('Supply a tour season id'),
      holiday_start_date: date('Supply a holiday start date'),
      status: str('Supply a status', false),
      booking_reference: str('Supply a booking reference', false, false),
      'customer.title': str('Supply a title'),
      'customer.first_name': str('Supply a first name'),
      'customer.last_name': str('Supply a last name'),
      'customer.email_address': email('Supply a email address'),
      'customer.telephone_number': tel('Supply a telephone number'),
      'customer.alternative_telephone_number': tel('Supply an alternative telephone number', false),
      'customer.country': str('Supply a country'),
      'customer.address_line_1': str('Supply a address'),
      'customer.address_line_2': str('Supply a second line of address', false),
      'customer.town': str('Supply a town'),
      'customer.county': str('Supply a county/state'),
      'customer.postcode': postcode('Supply a postcode/zip'),
      comments: str('Supply any comments', false, false),
      charges: {
        errorMessage: 'Supply any additional charges',
        isFloat: {
          options: {
            min: 0
          }
        },
        toFloat: true,
        optional: true
      },
      rooms: {
        errorMessage: 'Supply a list of rooms',
        optional: false,
        isLength: {
          options: {
            min: 1
          }
        }
      },
      'rooms.*.room_id': int('Supply a booking room id'),
      'rooms.*.tour_price_id': int('Supply a tour price id'),
      'rooms.*.extras': {
        errorMessage: 'Supply a list of extras',
        optional: true
      },
      'rooms.*.extras.*.tour_room_extra_id': int('Supply a room extra'),
      'rooms.*.extras.*.quantity': int('Supply a room extra quantity'),
      'rooms.*.extras.*.room_type_id': int('Supply a room extra room type'),
      'rooms.*.extras.*.accommodation_category_id': int('Supply a room extra accommodation category'),
      'rooms.*.extras.*.post': { isBoolean: true, optional: false },
      filters: {
        errorMessage: 'Supply a list of filters',
        optional: true
      },
      party: {
        errorMessage: 'Supply a party list',
        optional: false,
        isLength: {
          options: {
            min: 1
          }
        }
      },
      'party.*.title': str('Supply a title'),
      'party.*.first_name': str('Supply a first name'),
      'party.*.last_name': str('Supply a last name'),
      'party.*.date_of_birth': date('Supply a date of birth'),
      'party.*.height': int('Supply a height', false),
      'party.*.dietary_requirements': str('Supply any dietary requirements', false),
      'party.*.booking_room_id': int('Supply a room id'),
      'party.*.tour_bike_id': int('Supply a tour bike', false),
      'party.*.extras': {
        errorMessage: 'Supply a list of extras',
        optional: true
      },
      'party.*.extras.*.tour_party_extra_variation_id': int('Supply a room extra')
    };
  }

  static filters() {
    return ['guided', 'nights', 'boat_id', 'tour_route_id'];
  }

  static async getAll() {
    return await db.select(
        'bookings.id',
        'bookings.createdAt',
        'bookings.booking_reference',
        'bookings.status',
        'customers.id as customer_id',
        'customers.first_name',
        'customers.last_name',
        'customers.email_address',
        'tours.id as tour_id',
        'tours.name as tour_name',
        'tours.slug as tour_slug',
        'bookings.tour_season_id as tour_season_id'
      )
      .innerJoin('customers', 'bookings.customer_id', 'customers.id')
      .innerJoin('tours', 'bookings.tour_id', 'tours.id')
      .orderBy('createdAt', 'DESC')
      .from('bookings');
  }

  /**
   * Bundle up the booking and all associated meta data
   *
   * @param {int} id
   */
  static async get(id) {
    const booking = await this.get_booking_by_id(id);
    if (!booking) return null;

    await this.get_booking_additionals(booking);

    booking.payments = await PaymentsController.get_payments_for_booking(booking.id);

    return booking;
  }

  static async get_by_uuid(reference, time_limit = true) {
    if (!uuid.is(reference)) return null;

    const booking = await db(this.table()).where({ uuid: reference }).first();
    if (!booking) return null;

    await this.get_booking_additionals(booking);

    if (time_limit) {
      const payments = await PaymentsController.get_payments_for_booking(booking.id);
      const d = payments.length ? payments[payments.length - 1].createdAt : booking.createdAt;

      let now = new Date();
      now.setHours(now.getHours() - 2);
      if (((now - d) / 1000) > 0) return null;

      delete booking.net_at_booking;
      booking.rooms.forEach(room => {
        delete room.net;
        delete room.tour_price.formula;
        delete room.tour_price.gross;
        delete room.tour_price.non_com;
        delete room.tour_price.net;
        delete room.tour_price.adjustment;
        delete room.tour_price.markup_rate_id;

        room.extras.forEach(extra => {
          delete extra.net;
        });
      });

      booking.party.forEach(person => {
        person.extras.forEach(extra => {
          delete extra.net;
          delete extra.net;
          delete extra.variation.formula;
          delete extra.variation.gross;
          delete extra.variation.non_com;
          delete extra.variation.net;
          delete extra.variation.adjustment;
          delete extra.variation.markup_rate_id;
        });
      });
    }

    return booking;
  }

  static async get_booking_additionals(booking) {
    const id = booking.id;
    const [customer, tour, rooms, party] = await Promise.all([
      CustomersController.get_customer_by_id(booking.customer_id),
      ToursController.get_tour_by_id(booking.tour_id),
      BookingRoomsController.get_rooms_for_booking(id),
      PartyController.get_party_for_booking(id, booking.tour_season_id, booking.tour_id)
    ]);

    booking.customer = customer;
    booking.tour = tour;
    booking.tour.destinations = await DestinationsController.get_destinations_for_tour(tour.id);
    booking.rooms = rooms;
    booking.party = party;

    booking.tour.image = await MediaController.get_media_by_id(booking.tour.media_id);
  }

  static async get_booking(id) {
    const booking = await this.get(id);
    if (!booking) return null;
    const { tour_id } = booking;
    const [operator, itinerary, documentation_details, tour_meta, hotels, destinations, restaurants] = await Promise.all([
      OperatorsController.get(booking.tour.operator_id),
      TourItinerariesController.get_itineraries(tour_id, 'documentation'),
      TourDocumentationController.get(tour_id),
      TourMetaController.get(tour_id),
      HotelsController.get_hotels_for_tour(tour_id),
      DestinationsController.get_destinations_for_tour(tour_id),
      RestaurantsController.get_restaurants_for_tour(tour_id)
    ]);

    const documentation = {
      booking,
      operator,
      itinerary,
      documentation_details,
      tour_meta,
      hotels,
      destinations,
      restaurants
    };

    return documentation;
  }

  static get_booking_by_id(id) {
    return db
      .from('bookings')
      .where({ id })
      .first();
  }

  static get_booking_by_reference(reference) {
    return db
      .from('bookings')
      .where({ booking_reference: reference })
      .first();
  }

  static create_route() {
    return async (req, res) => {
      return this.create_or_update(req, res);
    };
  }

  static update_route() {
    return async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id || isNaN(id)) return h.notFound(res);
      const current = await this.get_booking_by_id(id);
      if (!current) return h.notFound(res);

      return this.create_or_update(req, res, id);
    };
  }

  static validate_data() {
    return (req, res, next) => {
      try {
        validationResult(req).throw();
        next();
      } catch (e) {
        return h.error(e, res);
      }
    };
  }

  /**
   * Validating a booking is a complex task so it's broken into several steps:
   *
   * - Check for the tour_id and tour_season_id
   * - Check the rooms
   * - Check the party
   * - Calculate reductions
   * - Calculate bookings
   */
  static validate_booking() {
    return async (req, res, next) => {
      try {
        const request = req.body;
        const filters = this.get_filters(request.filters || {});
        request.filters = filters;
        request.totals = {};
        request.net = {};

        const tour = await this.check_tour(request.tour_id);
        const deposit = await this.check_tour_season(request.tour_id, request.tour_season_id);
        request.totals.deposit = deposit * request.party.length;
        request.totals.balance = this.get_balance_date(request.holiday_start_date, tour.balance_due);
        request.totals.balance_due = tour.balance_due;

        const rooms = await RoomTypesController.getAll();

        await this.check_party(request);
        await this.check_rooms_are_not_overfilled(request, rooms);

        const bikeCosts = await this.calculate_bike_costs(request);
        request.totals.bikes = bikeCosts.cost;
        request.net.bikes = bikeCosts.net;

        const nights = filters.nights || tour.nights[0];
        const roomExtraCosts = await this.calculate_room_extras(request, nights, rooms);
        request.totals.room_extras = roomExtraCosts.cost;
        request.net.room_extras = roomExtraCosts.net;

        const partyExtaCosts = await this.calculate_party_extras(request);
        request.totals.party_extras = partyExtaCosts.cost;
        request.net.party_extras = partyExtaCosts.net;

        // Calculate reductions before costs, as reductions may change chargeable amount
        const reductionsTotals = await this.calculate_reductions(request);
        request.totals.reductions = reductionsTotals.total;
        request.net.reductions = reductionsTotals.net;

        const roomCosts = await this.calculate_room_costs(request, rooms);
        request.totals.rooms = roomCosts.cost;
        request.net.rooms = roomCosts.net;

        request.totals.offers = await this.calculate_offers(request, reductionsTotals.persons_idx);
        request.totals.charges = this.calculate_charges(request);
        request.charges = request.totals.charges;
        request.totals.total = request.totals.rooms + request.totals.bikes + request.totals.room_extras + request.totals.party_extras - request.totals.reductions - request.totals.offers + request.totals.charges;
        request.net.total = request.net.rooms + request.net.bikes + request.net.room_extras + request.net.party_extras - request.net.reductions;

        next();
      } catch (e) {
        console.log(e);
        return h.error(e, res);
      }
    };
  }

  static get_filters(request = {}) {
    const filters = {};
    this.filters().forEach(key => {
      if (key === 'boat_id') key = 'boat';
      if (request[key] !== undefined) {
        filters[key] = key === 'guided' ? Boolean(request[key]) : Number(request[key]);
      }
    });
    return filters;
  }

  static async check_tour(tour_id) {
    const tour = await ToursController.get_tour_by_id(tour_id);
    if (!tour) throw new Error('Tour does not exist');
    return tour;
  }

  static async check_tour_season(tour_id, tour_season_id) {
    const tour_seasons = await SeasonsControllers.get_tour_seasons_for_tour(tour_id);
    const tour_season = tour_seasons.find(tour_season => tour_season.id === tour_season_id);
    if (!tour_season) throw new Error('Tour season does not exist');

    return tour_season.deposit;
  }

  static get_balance_date(date, balance_due) {
    const d = new Thyme(date);
    d.remove(balance_due);
    return new Thyme() > d ? true : d.raw;
  }

  static async calculate_room_costs(request, rooms) {
    const tourPriceIds = request.rooms.map(room => room.tour_price_id);
    const chargeableTourPriceIds = request.rooms.map(room => room.chargeable.tour_price_id);
    const allPrices = await TourPricesController.get_prices(request.tour_id, [request.tour_season_id]);

    tourPriceIds.map(tour_price_id => {
      if (!allPrices.find(price => price.id === tour_price_id)) throw new Error(`Tour price ${tour_price_id} does not exist`);
    });
    chargeableTourPriceIds.map(tour_price_id => {
      if (!allPrices.find(price => price.id === tour_price_id)) throw new Error(`Tour price ${tour_price_id} does not exist`);
    });

    const prices = allPrices.filter(price => tourPriceIds.includes(price.id));
    const chargeablePrices = allPrices.filter(price => chargeableTourPriceIds.includes(price.id));
    const categories = await TourPricingCategoriesController.get_categories_by_ids(prices.map(p => p.category));

    let i = 0;
    const costs = tourPriceIds.reduce((running, tour_price_id) => {
      // Looping through the saved prices,
      // but we need to get the pricing data from the
      // chargeablePrices array...
      const price = prices.find(price => price.id === tour_price_id);
      const chargeablePrice = chargeablePrices.find(price => price.id === chargeableTourPriceIds[i]);

      const category = categories.find(category => category.id === chargeablePrice.category);
      // Need to get the room data from the original booking room, to get the correct 'sleeps' value
      const room = rooms.find(room => room.id === price.room_type_id);

      this.check_room_against_category(request.holiday_start_date, request.filters, category);

      const subTotal = chargeablePrice.cost * room.sleeps;
      const subTotalNet = chargeablePrice.net * room.sleeps;
      request.rooms.find(x => x.tour_price_id === tour_price_id).cost = subTotal;
      request.rooms.find(x => x.tour_price_id === tour_price_id).net = subTotalNet;
      running.cost += subTotal;
      running.net += subTotalNet;
      i++;

      return running;
    }, { cost: 0, net: 0 });

    return costs;
  }

  static check_room_against_category(start_date, filters, category) {
    const dates = h.get_dates(category);
    start_date = new Thyme(start_date);
    if (!dates.contains(start_date)) throw new Error('This date is not valid');

    this.filters().forEach(key => {
      const filter_key = key === 'boat_id' ? 'boat' : key;
      if (category[key] !== null && filters[filter_key] !== category[key]) {
        throw new Error(`This category does not match the filter: ${key}`);
      }
    });
  }

  static check_party(request) {
    const rooms = request.rooms.map(r => r.room_id);
    const partyRooms = request.party.map(p => p.booking_room_id);

    partyRooms.forEach(r => {
      if (!rooms.includes(r)) throw new Error(`Room ${r} does not exist`);
    });
  }

  static async check_rooms_are_not_overfilled(request, rooms) {
    const allPrices = await TourPricesController.get_prices(request.tour_id, [request.tour_season_id]);

    const assignedRooms = {};
    request.party.forEach(person => {
      if (!assignedRooms[person.booking_room_id]) assignedRooms[person.booking_room_id] = 0;
      assignedRooms[person.booking_room_id]++;
    });

    Object.keys(assignedRooms).forEach(key => {
      const booking_room = request.rooms.find(r => r.room_id === Number(key));
      if (!booking_room) throw new Error(`Room ${key} doesn't exist.`);

      const tour_price = allPrices.find(p => p.id === booking_room.tour_price_id);
      if (!tour_price) throw new Error(`Room ${key} doesn't exist`);

      const room = rooms.find(room => room.id === tour_price.room_type_id);
      if (room.sleeps < assignedRooms[key]) throw new Error(`There are too many people in room ${key}`);
    });
  }

  static async calculate_bike_costs(request) {
    let cost = 0;
    let net = 0;
    const bikes = await BikesController.get_admin_tour_bikes(request.tour_id, [request.tour_season_id]);
    request.party.forEach(person => {
      if (person.tour_bike_id) {
        const bike = bikes.find(b => b.id === person.tour_bike_id);
        if (!bike) throw new Error(`Tour bike ${person.tour_bike_id} does not exist`);
        cost += bike.cost;
        net += bike.net;
      }
    });
    return { cost, net };
  }

  static async calculate_room_extras(request, nights, rooms) {
    let cost = 0;
    let net = 0;
    const extras = await TourExtras.get_room_extras(request.tour_id, [request.tour_season_id]);
    request.rooms.forEach(room => {
      if (!room.extras) return;
      room.extras.forEach(extra_request => {
        let extra_cost = 0;
        let extra_net = 0;
        const extra = extras.find(e => e.id === extra_request.tour_room_extra_id);
        if (!extra) throw new Error(`Extra ${extra_request.tour_room_extra_id} does not exist`);
        if ((!extra.pre && !extra_request.post) || (!extra.post && extra_request.post)) throw new Error(`Extra ${extra.id} doesn't allow ${extra_request.post ? 'post' : 'pre'} bookings`);
        if (extra_request.quantity > 10 || extra_request.quantity < 1) throw new Error('Supply an extra quantity between 1 and 10');

        extra_request.tour_room_extra_variation_ids = [];

        let start = new Thyme(request.holiday_start_date);
        let end = new Thyme(request.holiday_start_date);
        end.add(nights);

        const room = rooms.find(room => room.id === extra_request.room_type_id || (extra_request.variation ? extra_request.variation.room_type_id : null));

        for (let offset = 0; offset < extra_request.quantity; offset++) {
          let room_price;
          if (extra_request.post) {
            end.add();
            room_price = this.get_room_extra_price(end, extra, extra_request);
          } else {
            start.remove();
            room_price = this.get_room_extra_price(start, extra, extra_request);
          }
          extra_cost += room_price.cost * room.sleeps;
          extra_net += room_price.net * room.sleeps;
        }

        extra_request.cost = extra_cost;
        extra_request.net = extra_net;
        cost += extra_cost;
        net += extra_net;
      });
    });

    return { cost, net };
  }

  static get_room_extra_price(date, extra, room_type) {
    const room_type_id = room_type.room_type_id || (room_type.variation ? room_type.variation.room_type_id : null);
    const accommodation_category_id = room_type.accommodation_category_id || (room_type.variation ? room_type.variation.accommodation_category_id : null);

    const contenders = extra.variations.filter(variation => {
      if (variation.room_type_id !== room_type_id) return false;
      if (variation.accommodation_category_id !== accommodation_category_id) return false;

      const dates = h.get_dates(variation);
      if (!dates.contains(date)) return false;

      return true;
    });

    if (!contenders.length) throw new Error(`Extra ${extra.id} has no matching variations`);

    contenders.sort((a, b) => a.cost - b.cost);

    room_type.tour_room_extra_variation_ids.push(contenders[0].id);

    return contenders[0];
  }

  static async calculate_party_extras(request) {
    let cost = 0;
    let net = 0;
    const extras = await TourExtras.get_party_extras(request.tour_id, [request.tour_season_id]);
    const totals = {};
    request.party.forEach(person => {
      if (person.extras) {
        person.extras.forEach(extra => {
          const id = extra.tour_party_extra_variation_id;

          const match = extras.find(e => {
            const matched_variation = e.variations.find(v => v.id === id);
            if (matched_variation) {
              e.variation = matched_variation;
              return true;
            }
          });

          if (!match) throw new Error(`Party extra ${id} does not exist`);

          if (!totals[match.id]) totals[match.id] = 0;
          totals[match.id]++;

          cost += match.variation.cost;
          net += match.variation.net;
          extra.cost = match.variation.cost;
          extra.net = match.variation.net;
        });
      }
    });

    Object.keys(totals).forEach(id => {
      const extra = extras.find(e => e.id === Number(id));
      if (!extra) return false;
      if (extra.variation.min_pax && totals[id] < extra.variation.min_pax) throw new Error(`Extra ${id} must have atleast ${extra.variation.min_pax} attendees`);
      if (extra.variation.max_pax && totals[id] > extra.variation.max_pax) throw new Error(`Extra ${id} must have fewer than ${extra.variation.max_pax} attendees`);
    });

    return { cost, net };
  }

  static async calculate_reductions(request) {
    /*
      Map the party.date_of_birth and group them into rooms
      Pass them over each input rule to see if we have a match,
      Count them up and check it exceeds the quantity
      If so, pass it over the output, only applying to those who match the min/max rules

      Input rule: { min: 18, quantity: 2 }
      Output rule: { min: 6, max: 13, percent: 50 }
      */
    let total = 0;
    let net = 0;
    let persons_idx = [];
    let hasReductions = false;
    const reductions = await TourReductionsControllers.get_reductions(request.tour_id, [request.tour_season_id]);
    const allPrices = await TourPricesController.get_prices(request.tour_id, [request.tour_season_id]);
    if (!reductions.length) return { total, net };

    const start = new Date(request.holiday_start_date);
    const rooms = request.party.reduce((current, person, idx) => {
      if (!current[person.booking_room_id]) current[person.booking_room_id] = [];

      const dateSplit = person.date_of_birth.split('-');
      let age;
      if (dateSplit.length === 3 && person.date_of_birth.length === 10) {
        age = new AgeAtDate(new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, dateSplit[2]), start).age;
      } else {
        age = '';
      }
      current[person.booking_room_id].push({age, idx});
      return current;
    }, {});

    if (!Object.keys(rooms).length) return { total, net };

    /*
    Loop the rooms, then the reductions
    Track a inputMatches flag and set it to true if there is no input or
    there in an input and we hit the criteria of min, max and quantity
    */
    Object.keys(rooms).forEach(roomID => {
      const persons = rooms[roomID];
      let output_count = 0;
      const room = request.rooms.find(r => r.room_id === Number(roomID));
      const _room = request._rooms.find(r => r.room_id === Number(roomID));
      if (room) {
        // Set cost, which may change if there's reductions
        const chargeableDefault = allPrices.find(p => p.id === room.tour_price_id);
        room.chargeable = { tour_price_id: chargeableDefault.id, net: chargeableDefault.net, cost: chargeableDefault.cost }
        // Define season
        room.tour_season_id = chargeableDefault.tour_season_id;

        reductions.filter(reduction => {
          let roomTypeFilter = true,
              deckFilter = true;
          if (reduction.room_type_id && _room.price.room_type_id) {
            roomTypeFilter = reduction.room_type_id === _room.price.room_type_id;
          }
          if (reduction.deck_id && _room.price.deck_id) {
            deckFilter = reduction.deck_id === _room.price.deck_id;
          }
          return roomTypeFilter && deckFilter;
        }).forEach(reduction => {
          let inputMatches = false;
          // Check seasons match
          if ((room.tour_season_id && reduction.tour_season_id) && room.tour_season_id == reduction.tour_season_id) {
            if (reduction.input_min === null && reduction.input_max === null) {
              inputMatches = true;
            } else {
              let quantityMatch = 0;
              persons.forEach(person => {
                if (!person.age) return;

                let internalMatch = 0;
                if (!reduction.input_min) internalMatch++;
                else if (person.age >= reduction.input_min) internalMatch++;

                if (!reduction.input_max) internalMatch++;
                else if (person.age <= reduction.input_max) internalMatch++;

                if (internalMatch === 2) quantityMatch++;
              });

              if (quantityMatch >= reduction.input_quantity) inputMatches = true;
            }
          }

          /*
          If the inputMatches, work through the outputs to find matches
          */
          if (inputMatches) {
            persons.forEach(person => {
              if (!person.age) return;

              let internalMatch = 0;
              if (!reduction.output_min) internalMatch++;
              else if (person.age >= reduction.output_min) internalMatch++;

              if (!reduction.output_max) internalMatch++;
              else if (person.age <= reduction.output_max) internalMatch++;

              if (internalMatch !== 2) return;

              if (reduction.output_quantity && output_count >= reduction.output_quantity) return;
              let tour_price = allPrices.find(p => p.id === room.tour_price_id);

              // Get room price to base the discount from
              allPrices.forEach(p => {
                if (p.accommodation_category_id && p.room_type_id && reduction.child_calc_accommodation && reduction.child_calc_room ) {
                  if ((p.category == tour_price.category) && (p.accommodation_category_id == reduction.child_calc_accommodation) && (p.room_type_id == reduction.child_calc_room) ) {
                    tour_price = p
                  }
                }
              })

              // NOTE: Removed reduction calculation logic by request
              /*
              if (reduction.percent) {
                total += tour_price.cost / 100 * reduction.percent;
                net += tour_price.net / 100 * reduction.percent;
              } else if (reduction.cost) {
                total += tour_price.cost - reduction.cost;
                net += tour_price.net - reduction.cost;
              }
              */

              // Set room price, based on discount room set in reductions
              // NOTE: Removed reduction calculation logic by request
              // room.chargeable = { tour_price_id: tour_price.id, net: tour_price.net, cost: tour_price.cost }

              persons_idx.push(person.idx)
              hasReductions = true;
            });
          }
        });
      }
    });
    return { total, net, persons_idx, hasReductions };
  }

  static async calculate_offers(request, reductionPersonsIdx) {
    let total = 0;
    const offers = await OffersController.get_offers_for_tour(request.tour_id);
    const bikes = await BikesController.get_tour_bikes(request.tour_id, [request.tour_season_id]);
    const now = new Date();
    const start = new Date(request.holiday_start_date);

    offers.forEach(offer => {
      if (offer.booking_window_start || offer.booking_window_end) {
        if (offer.booking_window_start && offer.booking_window_start > now) return false;
        if (offer.booking_window_end && offer.booking_window_end < now) return false;
      }

      if (offer.start_window_start || offer.start_window_end) {
        if (offer.start_window_start && offer.start_window_start > start) return false;
        if (offer.start_window_end && offer.start_window_end < start) return false;
      }

      if (offer.bike_ids && offer.bike_ids.length) {
        total += this.calculate_bike_offer(offer, request.party, bikes);
      } else {
        total += this.calculate_party_offer(offer, request, reductionPersonsIdx);
      }
    });

    return total;
  }

  static calculate_charges(request) {
    const n = Number(request.charges);
    return (!n || n < 0) ? 0 : n;
  }

  static calculate_bike_offer(offer, party, bikes) {
    const group_size = offer.type === '2for1bikes' ? 2 : 1;
    let subtotal = 0;

    let valid_bikes = bikes.filter(b => offer.bike_ids.includes(b.bike_id));
    const group = party
      .filter(p => p.tour_bike_id && valid_bikes.find(b => b.id === p.tour_bike_id))
      .reduce((c, p) => {
        c[p.tour_bike_id] = (c[p.tour_bike_id] || 0) + 1;
        return c;
      }, {});

    Object.keys(group).forEach(tour_bike_id => {
      const qualified = Math.floor(group[tour_bike_id] / group_size);
      if (qualified) subtotal += (qualified * bikes.find(b => b.id === Number(tour_bike_id)).cost);
    });

    return subtotal;
  }

  static calculate_party_offer(offer, request, reductionPersonsIdx) {
    let subtotal = 0;
    const start = new Date(request.holiday_start_date);

    request.party.forEach((person, idx) => {
      const dateSplit = person.date_of_birth.split('-');
      let age = 0;
      if (dateSplit.length === 3 && person.date_of_birth.length === 10) {
        age = new AgeAtDate(new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, dateSplit[2]), start).age;
      }

      if (reductionPersonsIdx.indexOf(idx) === -1) subtotal += offer.discount;
    });

    return subtotal;
  }

  static async calculate_arrival_dates(booking) {
    const tour = await ToursController.get_tour_by_id(booking.tour_id);
    const dateString = new Date(booking.holiday_start_date).toISOString();
    let start = new Thyme(dateString);
    let end = new Thyme(dateString);
    end.add((booking.filters && booking.filters.nights || '') || tour.nights[0]);

    const extra_pre_nights = booking.rooms
      .filter(r => r.extras.length && r.extras.find(e => !e.post))
      .map(e => e.extras.reduce((a, b) => a + b.quantity, 0));

    const pre_nights = Math.max(...extra_pre_nights, 0);
    if (pre_nights) start.remove(pre_nights);
    booking.arrival = start.raw;
    booking.arrival_label = h.formatDate(start) + (pre_nights ? ' (extra nights)' : '');

    const extra_post_nights = booking.rooms
      .filter(r => r.extras.length && r.extras.find(e => e.post))
      .map(e => e.extras.reduce((a, b) => a + b.quantity, 0));

    const post_nights = Math.max(...extra_post_nights, 0);
    if (post_nights) end.add(post_nights);
    booking.departure = end.raw;
    booking.departure_label = h.formatDate(end) + (post_nights ? ' (extra nights)' : '');
  }

  static async add_currency_to_booking(booking) {
    const tour_season = await TourSeasonsController.get(booking.tour_season_id);
    if (tour_season) {
      const currency = await CurrenciesController.get(tour_season.currency_id);
      if (currency && currency.rates) {
        const rate = currency.rates.find(x => x.season_id === tour_season.season_id);
        if (rate) {
          booking.currency_id = currency.id;
          booking.rate_at_booking = rate.rate;
        }
      }
    }
  }

  static async create_or_update(req, res, id = null) {
    try {

      /**
       * Link up link types and their respective controller
       */
      const types = [
        'rooms',
        'party',
        'customer',
        'filters'
      ];

      /**
       * Create the schema, parse the request and remove unnecessary additionals
       */
      const totals = req.body.totals;
      const net = req.body.net;
      const request = h.request(req.body, id, this.schema());

      request.total_cost = totals.total;
      request.total_rooms = totals.rooms;
      request.total_bikes = totals.bikes;
      request.total_room_extras = totals.room_extras;
      request.total_party_extras = totals.party_extras;
      request.total_reductions = totals.reductions;
      request.total_offers = totals.offers;
      request.total_charges = totals.charges || 0;
      delete request.charges;

      await this.calculate_arrival_dates(request);

      if (request.filters) {
        if (request.filters.boat) request.filter_boat = request.filters.boat;
        if (request.filters.from) request.filter_from = request.filters.from;
        if (request.filters.guided) request.filter_guided = request.filters.guided;
        if (request.filters.nights) request.filter_nights = request.filters.nights;
      }

      const additionals = types.reduce((c, k) => {
        if (req.body[k] !== undefined) c[k] = request[k];
        delete request[k];
        return c;
      }, {});

      let booking;
      let customer;
      if (id) {
        customer = await CustomersController.update(additionals.customer);
        request.customer_id = customer.id;

        booking = await this.update(request);
        if (!booking) return h.notFound(res);

        await BookingRoomsController.update(id, additionals.rooms);
        await BookingExtrasController.update(additionals.rooms);

        await PartyController.update(id, additionals.party);
        await PartyExtrasControllers.update(additionals.party);

        return res.json(booking);

      } else {

        request.status = 'pending';

        /**
         * Create customer, then booking
         */
        customer = await CustomersController.create(additionals.customer);
        request.customer_id = customer.id;
        request.booking_reference = await this.generate_booking_reference(request.arrival);
        request.uuid = uuid();
        request.total_deposit = totals.balance === true ? 0 : totals.deposit;
        request.total_at_booking = totals.balance === true ? totals.total : totals.total - totals.deposit;
        request.net_at_booking = net.total;

        await this.add_currency_to_booking(request);

        booking = await this.create(request);
        if (!booking) return h.notFound(res);
        id = booking.id;

        /**
         * Create rooms and update booking_room_id on people and extras
         */
        const newRooms = await Promise.all(additionals.rooms.map(room => BookingRoomsController.create({
          booking_id: id,
          tour_price_id: room.tour_price_id,
          cost: room.cost,
          net: room.net
        })));

        newRooms.forEach((newRoom, index) => {
          const oldId = additionals.rooms[index].room_id;

          additionals.party.forEach(person => {
            if (person.booking_room_id === oldId) {
              person.booking_room_id = newRoom.id;
            }
          });

          if (additionals.rooms[index].extras) {
            additionals.rooms[index].extras.forEach(extra => {
              extra.booking_room_id = newRoom.id;
            });
          }

          additionals.rooms[index].id = newRoom.id;
          additionals.rooms[index].room_id = newRoom.id;
        });

        await BookingExtrasController.update(additionals.rooms);

        /**
         * Create people and update person.id on extras
         */
        const newPeople = await Promise.all(additionals.party.map(person => PartyController.create({
          booking_id: id,
          title: person.title,
          first_name: person.first_name,
          last_name: person.last_name,
          date_of_birth: person.date_of_birth,
          height: person.height,
          dietary_requirements: person.dietary_requirements,
          tour_bike_id: person.tour_bike_id,
          booking_room_id: person.booking_room_id
        })));

        newPeople.forEach((newPerson, index) => {
          if (additionals.party[index].extras) {
            additionals.party[index].extras.forEach(extra => {
              extra.party_member_id = newPerson.id;
            });
          }

          additionals.party[index].id = newPerson.id;
        });

        await PartyExtrasControllers.update(additionals.party);

        await BookingSnapshotController.take_snapshot(id);

        return await PaymentsController.create_payment({
          booking_id: id,
          amount: request.total_at_booking,
          tx_type: 'DEFERRED'
        }, res);
      }
    } catch (e) {
      return h.error(e, res);
    }
  }

  static async generate_booking_reference(arrival) {
    const start = new Thyme(arrival);
    const year = start.getFullYear();
    const financial_year = new Thyme(`${year}-11-01`);
    let reference = String(year + (start > financial_year ? 1 : 0)).substring(2, 4) + '/';

    const last_booking = await db(this.table()).orderBy('id', 'DESC').first();
    reference += String(Number(last_booking.id) + 1).padStart(4, '0');
    return reference;
  }

  static async send_confirmation_email (id) {
    const booking = await this.get(id);
    await EmailsController.send('booking', booking, 'Thank you for your booking');
  }

  static async send_task_email(id, type) {
    const booking = await this.get(id);
    if (!booking) return;

    const subjects = {
      '6weeks': '6 weeks until your holiday begins!',
      '4weeks': 'Get in gear, not long now!',
      '2weeks': '2 weeks until your holiday begins!',
      'feedback': 'How was your holiday? Please let us know'
    };

    if (!subjects[type]) return;

    await EmailsController.send(type, booking, subjects[type]);
  }
}

export default BookingsController;
