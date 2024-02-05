/* eslint-disable object-curly-spacing */
import { fetchData } from './modules/APIUtils.js';
import { getDOMElements, renderGoods } from './modules/DOMUtils.js';
import { addEventListeners } from './modules/control.js';

const init = async () => {
  const database = await fetchData();
  const domElements = getDOMElements();

  renderGoods(database);
  addEventListeners(database, ...Object.values(domElements));
};

init();
