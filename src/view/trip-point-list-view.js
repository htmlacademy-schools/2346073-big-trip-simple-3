import AbstractView from '../framework/view/abstract-view';

export default class TripPointListView extends AbstractView {
  get template() {
    return createTripPointListTemplate();
  }
}

function createTripPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}
