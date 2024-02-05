/* eslint-disable object-curly-spacing */
import { fetchData } from './modules/APIUtils.js';
import { getDOMElements, renderGoods } from './modules/DOMUtils.js';
import { addEventListeners } from './modules/control.js';

const init = async () => {
  const database = await fetchData();
  const domElements = getDOMElements();

  domElements.overlay.classList.remove('active');

  addEventListeners(database, ...Object.values(domElements));
  renderGoods(database);
};

init();
