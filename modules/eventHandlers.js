/* eslint-disable object-curly-spacing */
import {
  getDOMElements,
  updateRowNumbers,
  updateTotalPrice,
} from './DOMUtils.js';
import { removeFromDatabase } from './dataUtils.js';

export const handleDeleteButtonClick = (item, currentDatabase) => {
  const { tableBody } = getDOMElements();
  const itemIdElement = item.querySelector('.table__cell-id');
  const itemId = parseInt(itemIdElement.textContent.replace('id: ', ''), 10);

  const { removedItem, newDb } = removeFromDatabase(itemId, currentDatabase);

  if (removedItem) {
    item.remove();

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

export const handlePicButtonClick = (target) => {
  const picUrl = target.dataset.pic;

  if (!picUrl) {
    return;
  }

  const width = 800;
  const height = 600;
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;

  window.open(
    picUrl,
    '_blank',
    `width=${width},
    height=${height},
    left=${left},
    top=${top}`,
  );
};
