/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
import {
  addRowToTable,
  updateModalTotalPrice,
  updateRowNumbers,
  updateTotalPrice,
} from './DOMUtils.js';
import { addToDatabase, generateRandomId, serializeForm } from './dataUtils.js';
import { handleDeleteButtonClick } from './eventHandlers.js';

export const addEventListeners = (
  database,
  overlay,
  addBtn,
  tableBody,
  discountCheckbox,
  discountCountInput,
  modalForm,
  countInput,
  priceInput,
  vendorCodeIdSpan,
) => {
  addBtn.addEventListener('click', () => {
    const newId = generateRandomId();
    vendorCodeIdSpan.textContent = `id: ${newId}`;
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', (e) => {
    const target = e.target;

    if (target === overlay || target.closest('.modal__close')) {
      overlay.classList.remove('active');
    }
  });

  tableBody.addEventListener('click', (e) => {
    const target = e.target;

    if (target.classList.contains('table__btn_del')) {
      const item = target.closest('.item');

      if (item) {
        database = handleDeleteButtonClick(item, database);
      }
    }
  });

  discountCheckbox.addEventListener('change', () => {
    discountCountInput.disabled = !discountCheckbox.checked;
  });

  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newId = parseInt(vendorCodeIdSpan.textContent.replace('id: ', ''));
    const formData = serializeForm(e.target);

    const count = parseInt(formData.get('count')) || 0;
    const price = parseFloat(formData.get('price')) || 0;

    const { newItem, newDb } = addToDatabase(
      newId,
      formData.get('name'),
      formData.get('category'),
      formData.get('units'),
      count,
      price,
      database,
    );

    addRowToTable(newItem);

    modalForm.reset();
    overlay.classList.remove('active');

    const updatedRows = updateRowNumbers(tableBody.querySelectorAll('.item'));
    updateTotalPrice(updatedRows);

    database = newDb;
  });

  countInput.addEventListener('input', () =>
    updateModalTotalPrice(countInput, priceInput));

  priceInput.addEventListener('input', () =>
    updateModalTotalPrice(countInput, priceInput));
};
