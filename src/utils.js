import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

const getRandomDate = () => {
  const year = Math.floor(Math.random() * 30) + 1990; // Random year between 1990 and 2019
  const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
  const day = Math.floor(Math.random() * 28) + 1; // Random day between 1 and 28
  const hours = Math.floor(Math.random() * 24); // Random hour between 0 and 23
  const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59
  const seconds = Math.floor(Math.random() * 60); // Random second between 0 and 59
  const milliseconds = Math.floor(Math.random() * 1000); // Random millisecond between 0 and 999

  const date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
  return date.toISOString(); // Returns the date in the format 'YYYY-MM-DDTHH:MM:SS.MSZ'
};

const getRandomId = () => Math.floor(Math.random() * 100) + 1;

const getRandomPic = () => `http://picsum.photos/248/152?r=${getRandomId()}`;

const descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.'];

const getRandomDescription = () => getRandomArrayElement(descriptions);

const getRandomCity = () => getRandomArrayElement(['Moscow', 'Saint-Petersburg', 'Paris', 'Washington']);

const humanizePointEditorDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');
const humanizePointDueDate = (dueData) => dayjs(dueData).format('MMM DD');
const getDateForDateTimeWithoutTime = (dueData) => dayjs(dueData).format('YYYY-MM-DD');
const getDateForDateTimeWithTime = (dueData) => dayjs(dueData).format('YYYY-MM-DDTHH:mm');
const getTimeFromDateTime = (dueDate) => dayjs(dueDate).format('HH:mm');

export { humanizePointDueDate, humanizePointEditorDueDate, getDateForDateTimeWithTime, getDateForDateTimeWithoutTime, getTimeFromDateTime, getRandomArrayElement, getRandomPrice, getRandomId, getRandomPic, getRandomDescription, getRandomCity, getRandomDate};
