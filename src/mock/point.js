import { getRandomArrayElement, getRandomDate, getRandomId, getRandomPrice } from '../utils';
import { getRandomDestination } from './destination';
import { getRandomOffers } from './offer';
import { POINT_TYPES } from './const';

const getRandomTripPoint = () => ({
  basePrice: getRandomPrice(),
  dateFrom: getRandomDate(),
  dateTo: getRandomDate(),
  destination: getRandomDestination(),
  id: getRandomId(),
  offers: getRandomOffers(),
  type: getRandomArrayElement(POINT_TYPES)
});


export { getRandomTripPoint };
