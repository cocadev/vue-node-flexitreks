import express from 'express';
import RoomTypes from '../controllers/RoomTypes';
import AccommodationCategories from '../controllers/AccommodationCategories';
import Decks from '../controllers/Decks';
const router = express.Router();

router.get(
  '/',
  async (req, res) => {
    const data = {};
    const [
      rooms,
      accommodation,
      decks
    ] = await Promise.all([
      RoomTypes.getAll(),
      AccommodationCategories.getAll(),
      Decks.getAll()
    ]);

    data.rooms = rooms;
    data.accommodation = accommodation;
    data.decks = decks;

    res.json(data);
  }
);

export default router;
