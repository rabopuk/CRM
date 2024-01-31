/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
'use strict';

const overlay = document.querySelector('.overlay');
const addBtn = document.querySelector('.panel__add-goods');
const tableBody = document.querySelector('.table__body');
const discountCheckbox = document.getElementById('discount');
const discountCountInput = document.querySelector('.modal__input_discount');
const modalForm = document.querySelector('.modal__form');
const countInput = document.getElementById('count');
const priceInput = document.getElementById('price');
const vendorCodeIdSpan = document.querySelector('.vendor-code__id');

let database = [];

const generateRandomId = () => Math.floor(Math.random() * 1000000000000000);

const getTotalPerItem = ({ count, price }) => count * price;

const getTotalSum = (itemsArray = []) => itemsArray.reduce((acc, item) => acc + getTotalPerItem(item), 0);

const fetchData = async () => {
  try {
    const response = await fetch('goods.json');
    const data = await response.json();
    console.log('database:', data);

    return data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return [];
  }
};

const createRowElement = (item, index) => {
  const { id, title, category, units, count, price } = item;
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

  return newRow;
};

const addToDatabase = (id, title, category, units, count, price, db) => {
  const newItem = { id, title, category, units, count, price };
  db.push(newItem);
  return newItem;
};

const addRowToTable = (item) => {
  const rows = tableBody.querySelectorAll('.item');
  const newRow = createRowElement(item, rows.length);
  tableBody.appendChild(newRow);
};

const extractItemDataFromRow = (row) => {
  const count = parseInt(row.querySelector('.table__cell:nth-child(5)').textContent) || 0;
  const price = parseFloat(row.querySelector('.table__cell:nth-child(6)').textContent.replace('$', '')) || 0;
  return { count, price };
};

const updateRowNumbers = async (rows) => {
  rows.forEach((row, index) => {
    row.querySelector('.table__cell:first-child').textContent = index + 1;
  });
};

const serializeForm = (form) => {
  const { elements } = form;
  const data = new FormData();

  [...elements]
    .filter((item) => !!item.name)
    .forEach(({ name, value }) => data.append(name, value));

  return data;
};

const updateTotalPrice = async () => {
  const rows = [...tableBody.querySelectorAll('.item')];
  const itemsData = rows.map(extractItemDataFromRow);
  const totalSum = getTotalSum(itemsData);

  const totalMain = document.querySelector('.cms__total-price');
  totalMain.textContent = `$ ${+totalSum.toFixed(2)}`;
};

const updateModalTotalPrice = (count, price) => {
  const modalTotalPrice = document.querySelector('.modal__total-price');
  const newCount = parseInt(count.value) || 0;
  const newPrice = parseFloat(price.value) || 0;
  const total = newCount * newPrice;
  modalTotalPrice.textContent = `$ ${+total.toFixed(2)}`;
};

const handleDeleteButtonClick = (item) => {
  const itemId = parseInt(item.querySelector('.table__cell:nth-child(1)').textContent);

  database = database.filter((dbItem) => dbItem.id !== itemId);

  item.remove();

  updateRowNumbers(tableBody.querySelectorAll('.item'));

  updateTotalPrice();
};

const renderGoods = (itemsArray) => {
  itemsArray.forEach(addRowToTable);
  updateRowNumbers(tableBody.querySelectorAll('.item'));
  updateTotalPrice();
};

overlay.classList.remove('active');

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
      handleDeleteButtonClick(item);
    }
  }
});

discountCheckbox.addEventListener('change', () => {
  discountCountInput.disabled = !discountCheckbox.checked;
});

modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (database.length === 0) {
    database = await fetchData();
    renderGoods(database);
  }

  const newId = parseInt(vendorCodeIdSpan.textContent.replace('id: ', ''));
  const formData = serializeForm(e.target);

  const count = parseInt(formData.get('count')) || 0;
  const price = parseFloat(formData.get('price')) || 0;

  const newItem = addToDatabase(newId, formData.get('name'), formData.get('category'), formData.get('units'), count, price, database);
  addRowToTable(newItem);

  console.log(database);
  console.log(newItem);

  modalForm.reset();
  overlay.classList.remove('active');

  updateRowNumbers(tableBody.querySelectorAll('.item'));
  updateTotalPrice();
});

countInput.addEventListener('input', () => updateModalTotalPrice(countInput, priceInput));

priceInput.addEventListener('input', () => updateModalTotalPrice(countInput, priceInput));

document.addEventListener('DOMContentLoaded', async () => {
  database = await fetchData();
  renderGoods(database);
});
