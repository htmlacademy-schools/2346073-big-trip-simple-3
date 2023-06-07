import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import TripPointModel from './model/points-model.js';
import {tripPoints} from './mock/point.js';
import {mockInit} from './mock/utils.js';

mockInit(5, 10);
const pageContainer = document.querySelector('.trip-events');
const siteFilterElement = document.querySelector('.trip-controls__filters');
const tripPointsModel = new TripPointModel(tripPoints);
const boardPresenter = new BoardPresenter({boardContainer: pageContainer, tripPointsModel});

render(new FilterView(), siteFilterElement);

boardPresenter.init();
