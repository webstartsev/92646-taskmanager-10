import moment from 'moment';

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const getFullDate = (date = new Date()) => {
  const dd = String(date.getDate()).padStart(2, `0`);
  const mm = String(date.getMonth() + 1).padStart(2, `0`);
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
};
