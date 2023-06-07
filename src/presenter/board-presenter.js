import {FilterType, SortType, UpdateType, UserAction} from '../const';
import {sorts} from '../utils/sorts';
import {filter} from '../utils/filter';
import {RenderPosition, render, remove} from '../framework/render.js';
import SortView from '../view/sort-view';
import NoPointsView from '../view/no-points-view';
import TripPointListView from '../view/trip-point-list-view';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripPointPresenter from './trip-point-presenter';
import NewTripPointPresenter from './new-trip-point-presenter';

const TimeLimit = {
  LOWER: 350,
  UPPER: 1000,
};

export default class BoardPresenter {
  #boardContainer = null;
  #tripPoints = null;
  #destinations = null;
  #offers = null;
  #filter = null;
  #tripPointsListComponent = new TripPointListView();
  #noTripPointComponent = null;
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #tripPointPresenter = new Map();
  #newTripPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER,
    upperLimit: TimeLimit.UPPER
  });

  constructor({boardContainer, tripPointsModel, destinationsModel, offersModel, filterModel, onNewTripPointDestroy}) {
    this.#boardContainer = boardContainer;
    this.#tripPoints = tripPointsModel;
    this.#destinations = destinationsModel;
    this.#offers = offersModel;
    this.#filter = filterModel;

    this.#newTripPointPresenter = new NewTripPointPresenter({
      tripPointListContainer: this.#tripPointsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTripPointDestroy
    });

    this.#tripPoints.addObserver(this.#handleModelEvent);
    this.#filter.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    this.#filterType = this.#filter.filter;
    const tripPoints = this.#tripPoints.tripPoints.sort(sorts[SortType.TIME]);
    const filteredTripPoints = filter[this.#filterType](tripPoints);
    return (sorts[this.#currentSortType]) ? filteredTripPoints.sort(sorts[this.#currentSortType]) : filteredTripPoints;
  }

  get destinations() {
    return this.#destinations.destinations;
  }

  get offers() {
    return this.#offers.offers;
  }

  init() {
    this.#renderBoard();
  }

  createTripPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filter.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if(this.#noTripPointComponent) {
      remove(this.#noTripPointComponent);
    }

    this.#newTripPointPresenter.init(this.destinations, this.offers);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD_TRIPPOINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.#tripPoints.addTripPoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.UPDATE_TRIPPOINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.#tripPoints.updateTripPoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_TRIPPOINT:
        this.#tripPointPresenter.get(update.id).setDeleting();
        try {
          await this.#tripPoints.deleteTripPoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenter.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoTripPoints() {
    this.#noTripPointComponent = new NoPointsView({
      filterType: this.#filterType
    });
    render(this.#noTripPointComponent, this.#boardContainer, RenderPosition.AFTERBEGIN );
  }

  #handleModeChange = () => {
    this.#newTripPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripPoint(tripPoint) {
    const tripPoinPresenter = new TripPointPresenter({
      tripPointList: this.#tripPointsListComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });

    tripPoinPresenter.init(tripPoint, this.destinations, this.offers);
    this.#tripPointPresenter.set(tripPoint.id, tripPoinPresenter);
  }

  #renderTripPoints(tripPoints) {
    tripPoints.forEach((tripPoint) => this.#renderTripPoint(tripPoint));

  }

  #clearBoard(resetSortType = false) {
    this.#newTripPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if(this.#noTripPointComponent) {
      remove(this.#noTripPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const tripPoints = this.tripPoints;

    if (tripPoints.length === 0) {
      this.#renderNoTripPoints();
      return;
    }

    this.#renderSort();
    render(this.#tripPointsListComponent, this.#boardContainer);
    this.#renderTripPoints(tripPoints);
  }
}
