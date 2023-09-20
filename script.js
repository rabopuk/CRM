/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
'use strict';

// В проекте CMS у элемента с классом overlay уберите класс active
const overlay = document.querySelector('.overlay');
overlay.classList.remove('active');

// Создайте функцию createRow, которая будет получать объект и на основе объекта формировать элемент
const tbody = document.querySelector('.table__body');

const createRow = (element, items) => {
  const newRow = document.createElement('tr');
  const { name, category, units, count, price } = items;
  newRow.classList.add('item');

  newRow.innerHTML = `
    <td class="table__cell">-</td>
    <td class="table__cell table__cell_left table__cell_name">
      <span class="table__cell-id">id: 24601654816512</span>
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

// Функция для сериализации формы в объект FormData
const serializeForm = form => {
  const { elements } = form;
  const data = new FormData();

  Array.from(elements)
    .filter(item => !!item.name)
    .forEach(element => {
      const { name, type } = element;
      const value = type === 'checkbox' ? element.checked : element.value;

      data.append(name, value);
    });

  return data;
};

// Создайте функцию renderGoods, принимает один параметр массив с объектами
// Функция renderGoods перебирает массив и вставляет строки, созданные на основе createRow, в таблицу
const renderGoods = itemsArray => {
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

// 1. В форме если поставить чекбокс должен быть разблокирован input с name discount_count
// 2. Если чекбокс убрать поле discount_count очищается и блокируется
const discountCheckbox = document.getElementById('discount');
const discountCountInput = document.querySelector('.modal__input_discount');

// Изменения состояния чекбокса
discountCheckbox.addEventListener('change', () => {
  // Если чекбокс отмечен, разблокировать поле ввода
  if (discountCheckbox.checked) {
    discountCountInput.disabled = false;
  } else {
    // Заблокировать поле ввода и очистить его
    discountCountInput.disabled = true;
    discountCountInput.value = '';
  }
});

// 3. Реализовать добавление нового товара из формы в таблицу
const modalForm = document.querySelector('.modal__form');

// Обработчик события отправки формы
modalForm.addEventListener('submit', e => {
  e.preventDefault();

  // Используем функцию для сериализации формы
  const formData = serializeForm(modalForm);

  // Новая строка для таблицы
  const newRow = createRow(tbody, Object.fromEntries(formData.entries()));

  // Текущее количество строк в таблице
  const rowCount = tableBody.rows.length;

  // Установить номер строки в первой ячейке
  newRow.querySelector('.table__cell:first-child').textContent = rowCount + 1;

  // Добавить новую строку в таблицу
  tableBody.append(newRow);

  // Очистить поля формы после добавления
  modalForm.reset();
  overlay.classList.remove('active');

  console.log('formData: ', Object.fromEntries(formData.entries()));
});

// 4. Все поля обязательны к заполнению(исключение изображение), можно реализовать с помощью атрибутов в html

// 5. Укажите правильный тип полей в html, для текста - text, для чисел - number

// 6. При открытии модального окна должен генерироваться случайный id и заполняться span с классом vendor - code__id

// 7. Итоговая стоимость в модальном окне должна правильно высчитываться при смене фокуса

// 8. Итоговая стоимость над таблицей должна корректно отображать сумму всех товаров
