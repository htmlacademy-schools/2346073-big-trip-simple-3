import AbstractView from '../framework/view/abstract-view.js';
export default class NoPointsView extends AbstractView{
  get template() {
    return createNoPointsTemplate();
  }
}

function createNoPointsTemplate () {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}
