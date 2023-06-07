import {generateDestinations} from './destination';
import {generateTripPoints} from './point';

const mockInit = (numberOfTripPoints, numberOfDestinations) => {
  generateDestinations(numberOfDestinations);
  generateTripPoints(numberOfTripPoints);
};

export {mockInit};
