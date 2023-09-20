/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
'use strict';

const overlay = document.querySelector('.overlay');
const addBtn = document.querySelector('.panel__add-goods');
const tableBody = document.querySelector('.table__body');
const discountCheckbox = document.getElementById('discount');
const discountCountInput = document.querySelector('.modal__input_discount');
const countInput = document.getElementById('count');
const priceInput = document.getElementById('price');
const modalForm = document.querySelector('.modal__form');


// В проекте CMS у элемента с классом overlay уберите класс active
overlay.classList.remove('active');


// Создайте функцию createRow, которая будет получать объект и на основе объекта формировать элемент
const createRow = (items) => {
  const newRow = document.createElement('tr');
  const { id, name, category, units, count, price } = items;
  newRow.classList.add('item');

  newRow.innerHTML = `
    <td class="table__cell">${id}</td>
    <td class="table__cell table__cell_left table__cell_name">
      <span class="table__cell-id">id: ${id}</span>
      ${name}
    </td>
    <td class="table__cell table__cell_left">${category}</td>
    <td class="table__cell">${units}</td>
    <td class="table__cell">${count}</td>
    <td class="table__cell">$${price}</td>
    <td class="table__cell">$${count * price}</td>
    <td class="table__cell table__cell_btn-wrapper">
      <button class="table__btn table__btn_pic"></button>
      <button class="table__btn table__btn_edit"></button>
      <button class="table__btn table__btn_del"></button>
    </td>
  `;

  return newRow;
};


// Обновление итоговой стоимости над таблицей
const updateTotalPriceAboveTable = () => {
  // Все строки товаров
  const rows = document.querySelectorAll('.item');

  // Сумма
  let total = 0;

  // Вычислить сумму
  rows.forEach(row => {
    const count = parseInt(row.querySelector('.table__cell:nth-child(5)').textContent);
    const price = parseInt(row.querySelector('.table__cell:nth-child(6)').textContent.replace('$', '')) || 0;
    total += count * price;
  });

  // Обновить текст итоговой стоимости над таблицей
  const totalAboveTable = document.querySelector('.cms__total-price');
  totalAboveTable.textContent = `$ ${total.toFixed(2)}`;
};


// При нажатии на кнопку "Добавить товар", открывать модальное окно
addBtn.addEventListener('click', () => {
  overlay.classList.add('active');
});


// Закрывать модальное окно без использования методов stopImmediatePropagation и stopPropagation
overlay.addEventListener('click', e => {
  const target = e.target;

  if (target === overlay || target.closest('.modal__close')) {
    overlay.classList.remove('active');
  }
});


// При клике на кнопку удалить в таблице, удалять строку из вёрстки и объект из базы данных
tableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('table__btn_del')) {
    const item = target.closest('.item');

    if (item) {
      item.remove();

      // Все строки таблицы после удаления товара
      const newRows = Array.from(tableBody.querySelectorAll('.item'));

      // В консоль выводить базу данных после удаления поля
      const tableData = newRows.map(row => {
        const rowData = Array.from(row.cells).map(cell => cell.textContent);
        return rowData;
      });

      console.log('БД: ', tableData);

      // Обновление итоговой стоимости над таблицей после удаления товара
      updateTotalPriceAboveTable();
    }
  }
});


// В форме если поставить чекбокс должен быть разблокирован input с name discount_count
discountCheckbox.addEventListener('change', () => {
  // Если чекбокс отмечен, разблокировать поле ввода
  if (discountCheckbox.checked) {
    discountCountInput.disabled = false;
  } else {
    // Если чекбокс убрать, поле discount_count очищается и блокируется
    discountCountInput.value = '';
    discountCountInput.disabled = true;
  }
});


// Генератор случайного ID
const generateRandomId = () => Math.floor(Math.random() * 1000000000000000);


// Сериализация формы в объект FormData
const serializeForm = form => {
  const { elements } = form;
  const data = new FormData();

  Array.from(elements)
    .filter(item => !!item.name)
    .forEach(element => {
      const { name } = element;
      const value = element.value;

      data.append(name, value);
    });

  return data;
};


// Пересчёт итоговой стоимости в модальном окне
const recalculateTotalPrice = () => {
  // Значения из полей Количество и Цена
  const count = parseInt(countInput.value) || 0;
  const price = parseInt(priceInput.value) || 0;

  // Итоговая стоимость
  const total = count * price;

  // Обновить текст итоговой стоимости в модальном окне
  const modalTotalPrice = document.querySelector('.modal__total-price');
  modalTotalPrice.textContent = `${total.toFixed(2)}`;
};
// Слушатели событий изменения полей Количество и Цена
countInput.addEventListener('input', recalculateTotalPrice);
priceInput.addEventListener('input', recalculateTotalPrice);


// Обработчик события отправки формы
modalForm.addEventListener('submit', e => {
  e.preventDefault();

  // Сериализация формы
  const formData = serializeForm(modalForm);

  // Случайный ID для нового товара
  const newItem = { id: generateRandomId(), ...Object.fromEntries(formData.entries()) };

  // Новая строка для таблицы
  const newRow = createRow(newItem);
  // Текущее количество строк в таблице
  const rowCount = tableBody.rows.length;

  // Установить номер строки в первой ячейке
  newRow.querySelector('.table__cell:first-child').textContent = rowCount + 1;
  // Добавить новую строку в таблицу
  tableBody.append(newRow);

  // Очистить поля формы после добавления
  modalForm.reset();
  overlay.classList.remove('active');

  // Обновление итоговой стоимости над таблицей после добавления товара
  updateTotalPriceAboveTable();

  const formDataArr = Array.from(formData.entries());

  // Данные строки
  console.log('formData: ', formDataArr);
});


// Создайте функцию renderGoods, принимает один параметр массив с объектами
// Функция renderGoods перебирает массив и вставляет строки, созданные на основе createRow, в таблицу
const renderGoods = itemsArray => {
  for (const item of itemsArray) {
    item.id = generateRandomId(); // случайный ID
    createRow(item);
  }

  // Обновление итоговой стоимости над таблицей после рендеринга товаров
  updateTotalPriceAboveTable();
};
// Пример данных
const itemsData = [
  {
    name: 'Навигационная система Soundmax Turbo',
    category: 'Техника для дома',
    units: 'шт',
    count: 7,
    price: 150,
  },
];
renderGoods(itemsData);


// Обновление итоговой стоимости после загрузки страницы
window.addEventListener('load', updateTotalPriceAboveTable);


// Удаление строки и обновление итоговой стоимости после удаления товара
tableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('table__btn_del')) {
    const item = target.closest('.item');

    if (item) {
      item.remove();
      updateTotalPriceAboveTable();
    }
  }
});
