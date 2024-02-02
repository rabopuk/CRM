/* eslint-disable object-curly-spacing */
import {
  getDOMElements,
  updateRowNumbers,
  updateTotalPrice,
} from './DOMUtils.js';
import { removeFromDatabase } from './dataUtils.js';

const { tableBody } = getDOMElements();

export const handleDeleteButtonClick = (item, currentDatabase) => {
  const itemIdElement = item.querySelector('.table__cell-id');
  const itemId = parseInt(itemIdElement.textContent.replace('id: ', ''), 10);

  const { removedItem, newDb } = removeFromDatabase(itemId, currentDatabase);

  if (removedItem) {
    item.remove();

    console.log(newDb);

    const updatedRows = updateRowNumbers(tableBody.querySelectorAll('.item'));

    if (newDb.length === 0) {
      const totalMain = document.querySelector('.cms__total-price');
      totalMain.textContent = '$ 0.00';
    } else {
      updateTotalPrice(updatedRows);
    }

    return newDb;
  }

  return currentDatabase;
};
