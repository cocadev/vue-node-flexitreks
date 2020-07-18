import Vue from 'vue'
import Router from 'vue-router'
import Destinations from './views/destinations/Destinations.vue'
import Destination from './views/destinations/Destination.vue'
import DestinationCreate from './views/destinations/CreateDestination.vue'
import Regions from './views/regions/Regions.vue'
import Region from './views/regions/Region.vue'
import RegionCreate from './views/regions/CreateRegion.vue'
import Bikes from './views/bikes/Bikes.vue'
import Bike from './views/bikes/Bike.vue'
import BikeCreate from './views/bikes/CreateBike.vue'
import Boats from './views/boats/Boats.vue'
import Boat from './views/boats/Boat.vue'
import BoatCreate from './views/boats/CreateBoat.vue'
import Decks from './views/decks/Decks.vue'
import Deck from './views/decks/Deck.vue'
import DeckCreate from './views/decks/CreateDeck.vue'
import Currencies from './views/currencies/Currencies.vue'
import Currency from './views/currencies/Currency.vue'
import CurrencyCreate from './views/currencies/CreateCurrency.vue'
import Models from './views/models/Models.vue'
import Model from './views/models/Model.vue'
import ModelCreate from './views/models/CreateModel.vue'
import Hotels from './views/hotels/Hotels.vue'
import Hotel from './views/hotels/Hotel.vue'
import HotelCreate from './views/hotels/CreateHotel.vue'
import Operators from './views/operators/Operators.vue'
import Operator from './views/operators/Operator.vue'
import OperatorCreate from './views/operators/CreateOperator.vue'
import Restaurants from './views/restaurants/Restaurants.vue'
import Restaurant from './views/restaurants/Restaurant.vue'
import RestaurantCreate from './views/restaurants/CreateRestaurant.vue'
import RoomTypes from './views/room-types/RoomTypes.vue'
import RoomType from './views/room-types/RoomType.vue'
import RoomTypeCreate from './views/room-types/CreateRoomType.vue'
import Seasons from './views/seasons/Seasons.vue'
import Season from './views/seasons/Season.vue'
import SeasonCreate from './views/seasons/CreateSeason.vue'
import AccommodationCategories from './views/accommodation-categories/AccommodationCategories.vue'
import AccommodationCategory from './views/accommodation-categories/AccommodationCategory.vue'
import AccommodationCategoryCreate from './views/accommodation-categories/CreateAccommodationCategory.vue'
import Tours from './views/tours/Tours.vue'
import Tour from './views/tours/Tour.vue'
import TourCreate from './views/tours/Create.vue'
import Itineraries from './views/tours/Itineraries.vue'
import TourDocumentation from './views/tours/Documentation.vue'
import TourSeasons from './views/tours/Seasons.vue'
import TourDetails from './views/tours/Details.vue'
import TourBikes from './views/tours/Bikes.vue'
import TourRoutes from './views/tours/Routes.vue'
import TourPricing from './views/tours/Pricing.vue'
import TourPartyExtras from './views/tours/PartyExtras.vue'
import TourRoomExtras from './views/tours/RoomExtras.vue'
import TourReductions from './views/tours/Reductions.vue'
import TourSpecifications from './views/tours/Specifications.vue'
import TourDataExport from './views/tours/DataExport.vue'
import Bookings from './views/bookings/Bookings.vue'
import Booking from './views/bookings/Booking.vue'
import BookingEdit from './views/bookings/Edit.vue'
import BookingSnapshot from './views/bookings/Snapshot.vue'
import Documentation from './views/bookings/Documentation.vue'
import Pages from './views/pages/Pages.vue'
import Page from './views/pages/Page.vue'
import PageInspiration from './views/pages/PageInspiration.vue'
import PageBlocks from './views/pages/PageBlocks.vue'
import PageCreate from './views/pages/CreatePage.vue'
import Payments from './views/payments/Payments.vue'
import Payment from './views/payments/Payment.vue'
import PaymentCreate from './views/payments/CreatePayment.vue'
import Enquiries from './views/enquiries/Enquiries.vue'
import Enquiry from './views/enquiries/Enquiry.vue'
import Offers from './views/offers/Offers.vue'
import Offer from './views/offers/Offer.vue'
import OfferCreate from './views/offers/CreateOffer.vue'
import Media from './views/media/Media.vue'
import Global from './views/Global.vue'
import Options from './views/Options.vue'
import PGT from './views/pgt/index.vue'
import Login from './views/Login.vue'
import HomepageCollections from './views/homepage-collections/HomepageCollections.vue'
import Navigations from './views/Navigations.vue'
import Categories from './views/categories/Categories.vue'
import Category from './views/categories/Category.vue'
import CategoryCreate from './views/categories/CreateCategory.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Bookings
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/pgt',
      name: 'pgt',
      component: PGT
    },
    {
      path: '/destinations',
      name: 'destinations',
      component: Destinations
    },
    {
      path: '/destinations/create',
      name: 'destination-create',
      component: DestinationCreate
    },
    {
      path: '/destinations/:id',
      name: 'destination',
      component: Destination,
      props: true
    },
    {
      path: '/regions',
      name: 'regions',
      component: Regions
    },
    {
      path: '/regions/create',
      name: 'region-create',
      component: RegionCreate
    },
    {
      path: '/regions/:id',
      name: 'region',
      component: Region,
      props: true
    },
    {
      path: '/bikes',
      name: 'bikes',
      component: Bikes
    },
    {
      path: '/bikes/create',
      name: 'bike-create',
      component: BikeCreate
    },
    {
      path: '/bikes/:id',
      name: 'bike',
      component: Bike,
      props: true
    },
    {
      path: '/boats',
      name: 'boats',
      component: Boats
    },
    {
      path: '/boats/create',
      name: 'boat-create',
      component: BoatCreate
    },
    {
      path: '/boats/:id',
      name: 'boat',
      component: Boat,
      props: true
    },
    {
      path: '/decks',
      name: 'decks',
      component: Decks
    },
    {
      path: '/decks/create',
      name: 'deck-create',
      component: DeckCreate
    },
    {
      path: '/decks/:id',
      name: 'deck',
      component: Deck,
      props: true
    },
    {
      path: '/currencies',
      name: 'currencies',
      component: Currencies
    },
    {
      path: '/currencies/create',
      name: 'currency-create',
      component: CurrencyCreate
    },
    {
      path: '/currencies/:id',
      name: 'currency',
      component: Currency,
      props: true
    },
    {
      path: '/models',
      name: 'models',
      component: Models
    },
    {
      path: '/models/:id/:season_id',
      name: 'model',
      component: Model,
      props: true
    },
    {
      path: '/models/create',
      name: 'model-create',
      component: ModelCreate
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: Hotels
    },
    {
      path: '/hotels/create',
      name: 'hotel-create',
      component: HotelCreate
    },
    {
      path: '/hotels/:id',
      name: 'hotel',
      component: Hotel,
      props: true
    },
    {
      path: '/operators',
      name: 'operators',
      component: Operators
    },
    {
      path: '/operators/create',
      name: 'operator-create',
      component: OperatorCreate
    },
    {
      path: '/operators/:id',
      name: 'operator',
      component: Operator,
      props: true
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: Restaurants
    },
    {
      path: '/restaurants/create',
      name: 'restaurant-create',
      component: RestaurantCreate
    },
    {
      path: '/restaurants/:id',
      name: 'restaurant',
      component: Restaurant,
      props: true
    },
    {
      path: '/room-types',
      name: 'room-types',
      component: RoomTypes
    },
    {
      path: '/room-types/create',
      name: 'room-type-create',
      component: RoomTypeCreate
    },
    {
      path: '/room-types/:id',
      name: 'room-type',
      component: RoomType,
      props: true
    },
    {
      path: '/accommodation-categories',
      name: 'accommodation-categories',
      component: AccommodationCategories
    },
    {
      path: '/accommodation-categories/create',
      name: 'accommodation-category-create',
      component: AccommodationCategoryCreate
    },
    {
      path: '/accommodation-categories/:id',
      name: 'accommodation-category',
      component: AccommodationCategory,
      props: true
    },
    {
      path: '/seasons',
      name: 'seasons',
      component: Seasons
    },
    {
      path: '/seasons/create',
      name: 'season-create',
      component: SeasonCreate
    },
    {
      path: '/seasons/:id',
      name: 'season',
      component: Season,
      props: true
    },
    {
      path: '/tours',
      name: 'tours',
      component: Tours
    },
    {
      path: '/tours/create',
      name: 'tour-create',
      component: TourCreate
    },
    {
      path: '/tours/:id',
      name: 'tour',
      component: Tour,
      props: true
    },
    {
      path: '/tours/:id/itineraries',
      name: 'itineraries',
      component: Itineraries,
      props: true
    },
    {
      path: '/tours/:id/documentation',
      name: 'tour-documentation',
      component: TourDocumentation,
      props: true
    },
    {
      path: '/tours/:id/seasons',
      name: 'tour-seasons',
      component: TourSeasons,
      props: true
    },
    {
      path: '/tours/:id/details',
      name: 'tour-details',
      component: TourDetails,
      props: true
    },
    {
      path: '/tours/:id/bikes',
      name: 'tour-bikes',
      component: TourBikes,
      props: true
    },
    {
      path: '/tours/:id/routes',
      name: 'tour-routes',
      component: TourRoutes,
      props: true
    },
    {
      path: '/tours/:id/pricing',
      name: 'tour-pricing',
      component: TourPricing,
      props: true
    },
    {
      path: '/tours/:id/party-extras',
      name: 'tour-party-extras',
      component: TourPartyExtras,
      props: true
    },
    {
      path: '/tours/:id/room-extras',
      name: 'tour-room-extras',
      component: TourRoomExtras,
      props: true
    },
    {
      path: '/tours/:id/reductions',
      name: 'tour-reductions',
      component: TourReductions,
      props: true
    },
    {
      path: '/tours/:id/specifications',
      name: 'tour-specifications',
      component: TourSpecifications,
      props: true
    },
    {
      path: '/tours/:id/data-export',
      name: 'tour-data-export',
      component: TourDataExport,
      props: true
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: Bookings
    },
    {
      path: '/bookings/:id',
      name: 'booking',
      component: Booking,
      props: true
    },
    {
      path: '/bookings/edit/:id',
      name: 'booking-edit',
      component: BookingEdit,
      props: true
    },
    {
      path: '/bookings/snapshot/:id',
      name: 'booking-snapshot',
      component: BookingSnapshot,
      props: true
    },
    {
      path: '/bookings/:id/documentation',
      name: 'documentation',
      component: Documentation,
      props: true
    },
    {
      path: '/pages',
      name: 'pages',
      component: Pages
    },
    {
      path: '/pages/create',
      name: 'page-create',
      component: PageCreate
    },
    {
      path: '/pages/inspiration/:slug/:section?/',
      name: 'page-inspiration',
      component: PageInspiration,
      props: true
    },
    {
      path: '/pages/explore/:slug/:section?/',
      name: 'explore',
      component: PageBlocks,
      props: true
    },
    {
      path: '/pages/:slug/:section?',
      name: 'page',
      component: Page,
      props: true
    },
    {
      path: '/offers',
      name: 'offers',
      component: Offers
    },
    {
      path: '/offers/create',
      name: 'offer-create',
      component: OfferCreate
    },
    {
      path: '/offers/:id/',
      name: 'offer',
      component: Offer,
      props: true
    },
    {
      path: '/payments',
      name: 'payments',
      component: Payments
    },
    {
      path: '/payments/create',
      name: 'payment-create',
      component: PaymentCreate
    },
    {
      path: '/payments/:id',
      name: 'payment',
      component: Payment,
      props: true
    },
    {
      path: '/enquiries',
      name: 'enquiries',
      component: Enquiries
    },
    {
      path: '/enquiries/:id',
      name: 'enquiry',
      component: Enquiry,
      props: true
    },
    {
      path: '/media',
      name: 'media',
      component: Media
    },
    {
      path: '/global',
      name: 'global',
      component: Global
    },
    {
      path: '/options',
      name: 'options',
      component: Options
    },
    {
      path: '/homepage-collections',
      name: 'homepage-collections',
      component: HomepageCollections
    },
    {
      path: '/navigations',
      name: 'navigations',
      component: Navigations
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/categories/create',
      name: 'category-create',
      component: CategoryCreate
    },
    {
      path: '/categories/:id',
      name: 'category',
      component: Category,
      props: true
    }
  ]
})
