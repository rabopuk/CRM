/* eslint-disable max-len */
'use strict';

// В проекте CMS у элемента с классом overlay уберите класс active
const overlay = document.querySelector('.overlay');
overlay.classList.remove('active');


// Создайте функцию createRow, которая будет получать объект и на основе объекта формировать элемент
const tbody = document.querySelector('.table__body');

let n = 3;

const createRow = (element, items) => {
  const newRow = document.createElement('tr');
  newRow.classList.add('item');

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


// Создайте функцию renderGoods, принимает один параметр массив с объектами
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


// При нажатии на кнопку "Добавить товар", открывать модальное окно
const addBtn = document.querySelector('.panel__add-goods');
addBtn.addEventListener('click', () => {
  overlay.classList.add('active');
});


// При нажатии на крестик или мимо модального окна, закрывать его
// const modalClose = document.querySelector('.modal__close');
// const overlayModal = document.querySelector('.overlay__modal');

// modalClose.addEventListener('click', () => {
//   overlay.classList.remove('active');
// });

// overlayModal.addEventListener('click', event => {
//   // Прерывание всплытия
//   event.stopPropagation();
// });

// overlayModal.addEventListener('click', () => {
//   overlay.classList.remove('active');
// });


// Закрывать модальное окно без использования методов stopImmediatePropagation и stopPropagation
overlay.addEventListener('click', e => {
  const target = e.target;

  if (target === overlay || target.closest('.modal__close')) {
    overlay.classList.remove('active');
  }
});


// При клике на кнопку удалить в таблице, удалять строку из вёрстки и объект из базы данных
// В консоль выводить базу данных после удаления поля
const tableBody = document.querySelector('.table__body');
const tRows = tableBody.querySelectorAll('.item');

tableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('table__btn_del')) {
    const item = target.closest('.item');

    if (item) {
      item.remove();

      const newRows = [...tRows].filter(row => row !== item);
      console.log('БД: ', [...newRows]);
    }
  }
});
