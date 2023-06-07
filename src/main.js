import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPointModel from './model/trip-point-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewTripPointButtonView from './view/new-trip-point-button-view.js';
import TripPointApi from './trip-point-api-service.js';

const AUTH = 'Basic pitachoks';
const DOMAIN = 'https://18.ecmascript.pages.academy/big-trip';
const tripPointAPI = new TripPointApi(DOMAIN, AUTH);

const board = document.querySelector('.trip-events');
const siteFilter = document.querySelector('.trip-controls__filters');
const siteHeader = document.querySelector('.trip-main');

const tripPoints = new TripPointModel({
  tripPointApiService: tripPointAPI
});

const destinations = new DestinationsModel({tripPointApiService: tripPointAPI});
const offers = new OffersModel({tripPointApiService: tripPointAPI});
const filter = new FilterModel();

const newTripPointButtonComponent = new NewTripPointButtonView({
  onClick: handleNewTripPointButtonClick
});

const boardPresenter = new BoardPresenter({
  boardContainer: board,
  tripPointsModel: tripPoints,
  destinationsModel: destinations,
  offersModel: offers,
  filterModel: filter,
  onNewTripPointDestroy
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilter,
  filterModel: filter,
  tripPointsModel: tripPoints
});

function handleNewTripPointButtonClick() {
  boardPresenter.createTripPoint();
  newTripPointButtonComponent.element.disabled = true;
}

function onNewTripPointDestroy() {
  newTripPointButtonComponent.element.disabled = false;
}

filterPresenter.init();
boardPresenter.init();
tripPoints.init()
  .finally(() => {
    render(newTripPointButtonComponent, siteHeader);
  });
