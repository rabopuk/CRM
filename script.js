/* eslint-disable max-len */
'use strict';

// 1. В проекте CMS у элемента с классом overlay уберите класс active
const overlay = document.querySelector('.overlay');
overlay.classList.toggle('active');


// 2. Создайте функцию createRow, которая будет получать объект и на основе объекта формировать элемент
const tbody = document.querySelector('.table__body');

let n = 3;

const createRow = (element, items) => {
  const newRow = document.createElement('tr');

  newRow.innerHTML =
    `
      <td class="table__cell">${n++}</td>
      <td class="table__cell table__cell_left table__cell_name"
      data-id="${items.dataId}">
        <span class="table__cell-id">id: ${items.dataId}</span>
        ${items.name}
      </td>
      <td class="table__cell table__cell_left">${items.category}</td>
      <td class="table__cell">${items.unit}</td>
      <td class="table__cell">${items.quantity}</td>
      <td class="table__cell">$${items.price}</td>
      <td class="table__cell">$${items.total()}</td>
      <td class="table__cell table__cell_btn-wrapper">
        <button class="table__btn table__btn_pic"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    `;

  element.appendChild(newRow);
};


// 3. Создайте функцию renderGoods, принимает один параметр массив с объектами
// Функция renderGoods перебирает массив и вставляет строки, созданные на основе createRow, в таблицу
const renderGoods = (itemsArray) => {
  for (const item of itemsArray) {
    createRow(tbody, item);
  }
};
// Пример данных
const itemsData = [
  {
    id: 5,
    dataId: 132123412,
    name: 'Навигационная система Soundmax Turbo',
    category: 'Техника для дома',
    unit: 'шт',
    quantity: 7,
    price: 150,
    total() {
      return this.quantity * this.price;
    },
  },
];

renderGoods(itemsData);
