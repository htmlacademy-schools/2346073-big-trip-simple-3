import {getRandomPoint} from '../mock/point.js';

export default class PointsModel {
  points = Array.from({length: 3}, getRandomPoint);

  getTasks = () => this.points;
}
