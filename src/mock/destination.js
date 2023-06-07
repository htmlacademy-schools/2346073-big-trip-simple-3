import {descriptionPhrases, namesOfPlaces} from '../const';
import {getRandomItemFromItems, createIDgenerator} from '../utils/utils';

const NUMBER_OF_PICTURES = Math.floor(Math.random() * 6) + 1;
const destinations = [];

const generatePicId = createIDgenerator();
const generatePictures = () => {
  const pictures = [];
  for (let i = 0; i < NUMBER_OF_PICTURES; i++) {
    const picture = {
      src: `img/photos/${generatePicId()}.jpg`,
      description: getRandomItemFromItems(descriptionPhrases)
    };
    pictures.push(picture);
  }
  return pictures;
};

const generateDestinationId = createIDgenerator();
const generateDestinations = (n) => {
  for (let i = 0; i < n; i++) {
    const destination = {
      id: generateDestinationId(),
      description: getRandomItemFromItems(descriptionPhrases),
      name: getRandomItemFromItems(namesOfPlaces),
      pictures: generatePictures()
    };
    destinations.push(destination);
  }
};

export {generateDestinations, destinations};
