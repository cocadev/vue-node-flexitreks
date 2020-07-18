import Controller from './Controller';
import int from '../schema/int';

class RoomTypesController extends Controller {
  static table() { return 'room_types'; }

  static schema() {
    const schema = super.schema();
    schema.sleeps = int('Supply a room size', false);
    return schema;
  }
}

export default RoomTypesController;
