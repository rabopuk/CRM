/* eslint-disable object-curly-spacing */
import { getTotalSum } from './dataUtils.js';

export const getDOMElements = () => {
  const overlay = document.querySelector('.overlay');
  const addBtn = document.querySelector('.panel__add-goods');
  const tableBody = document.querySelector('.table__body');
  const discountCheckbox = document.getElementById('discount');
  const discountCountInput = document.querySelector('.modal__input_discount');
  const modalForm = document.querySelector('.modal__form');
  const countInput = document.getElementById('count');
  const priceInput = document.getElementById('price');
  const vendorCodeIdSpan = document.querySelector('.vendor-code__id');
  const picButton = document.querySelector('.table__btn_pic');

  return {
    overlay,
    addBtn,
    tableBody,
    discountCheckbox,
    discountCountInput,
    modalForm,
    countInput,
    priceInput,
    vendorCodeIdSpan,
    picButton,
  };
};

export const createRowElement = (item, index) => {
  const { id, title, category, units, count, price, picUrl } = item;
  const newRow = document.createElement('tr');
  newRow.classList.add('item');

  newRow.innerHTML = `
    <td class="table__cell">${index + 1}</td>
    <td class="table__cell table__cell_left table__cell_name">
      <span class="table__cell-id">id: ${id}</span>
      ${title}
    </td>
    <td class="table__cell table__cell_left">${category}</td>
    <td class="table__cell">${units}</td>
    <td class="table__cell">${count}</td>
    <td class="table__cell">$${+price.toFixed(2)}</td>
    <td class="table__cell">$${+(count * price).toFixed(2)}</td>
    <td class="table__cell table__cell_btn-wrapper">
      <button class="table__btn table__btn_pic"></button>
      <button class="table__btn table__btn_edit"></button>
      <button class="table__btn table__btn_del"></button>
    </td>
  `;

  const picButton = newRow.querySelector('.table__btn_pic');
  // picButton.dataset.pic = picUrl;
  // ! для демонстрации заменяю на свою картинку
  picButton.dataset.pic = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Artist%27s_impression_of_supernova_1993J.jpg/800px-Artist%27s_impression_of_supernova_1993J.jpg';

  return newRow;
};

export const addRowToTable = (item) => {
  const { tableBody } = getDOMElements();
  const rows = tableBody.querySelectorAll('.item');
  const newRow = createRowElement(item, rows.length);
  tableBody.appendChild(newRow);
};

export const extractItemDataFromRow = (row) => {
  const count = parseInt(row.querySelector('.table__cell:nth-child(5)')
    .textContent) || 0;
  const price = parseFloat(row.querySelector('.table__cell:nth-child(6)')
    .textContent.replace('$', '')) || 0;

  return { count, price };
};

export const updateRowNumbers = (rows) => {
  const rowNumbers = [...rows];
  rowNumbers.forEach((row, index) => {
    row.querySelector('.table__cell:first-child').textContent = index + 1;
  });

  return rowNumbers;
};

export const updateTotalPrice = (rows) => {
  const itemsData = [...rows].map(extractItemDataFromRow);
  const totalSum = getTotalSum(itemsData);
  const totalMain = document.querySelector('.cms__total-price');
  totalMain.textContent = `$ ${+totalSum.toFixed(2)}`;
};

export const updateModalTotalPrice = (count, price) => {
  const modalTotalPrice = document.querySelector('.modal__total-price');
  const newCount = parseInt(count.value) || 0;
  const newPrice = parseFloat(price.value) || 0;
  const total = newCount * newPrice;
  modalTotalPrice.textContent = `$ ${+total.toFixed(2)}`;
};

export const renderGoods = (itemsArray) => {
  const { tableBody } = getDOMElements();

  tableBody.innerHTML = '';

  itemsArray.forEach((item, index) => {
    const newRow = createRowElement(item, index);
    tableBody.appendChild(newRow);
  });

  const rowNumbers = updateRowNumbers(tableBody.querySelectorAll('.item'));
  updateTotalPrice(rowNumbers);
};
