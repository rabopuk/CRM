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
const vendorCodeIdSpan = document.querySelector('.vendor-code__id');

let database = [];

// Функция для преобразования строки в число
const parseIntFromString = (str) => parseInt(str);

// Функция для преобразования строки в число с плавающей точкой
const parseFloatFromString = (str) => parseFloat(str);

// Функция для вычисления суммы по каждому товару
const getTotalPerItem = ({ count, price }) => count * price;

// Функция для вычисления общей суммы
const getTotalSum = (itemsArray = []) => itemsArray.reduce((acc, item) => acc + getTotalPerItem(item), 0);

// Создание элемента строки таблицы
const createRowElement = (item) => {
  const newRow = document.createElement('tr');
  const { id, title, category, units, count, price } = item;
  newRow.classList.add('item');

  newRow.innerHTML = `
    <td class="table__cell"></td>
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

// Запрос к базе данных
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

// Добавить новый товар в базу данных
const addToDatabase = (id, title, category, units, count, price) => {
  const newItem = {
    id,
    title,
    category,
    units,
    count,
    price,
  };

  database.push(newItem);

  return newItem;
};

// В проекте CMS у элемента с классом overlay уберите класс active
overlay.classList.remove('active');

// Генератор случайного ID
const generateRandomId = () => Math.floor(Math.random() * 1000000000000000);

// При открытии модального окна генерируется и отображается ID
addBtn.addEventListener('click', () => {
  const newId = generateRandomId();
  vendorCodeIdSpan.textContent = `id: ${newId}`;
  overlay.classList.add('active');
});

// Обновить общую итоговую стоимость
const updateTotalPriceMain = () => {
  // Все строки товаров
  const rows = document.querySelectorAll('.item');

  // Преобразовать NodeList в массив объектов
  const itemsArray = [...rows].map(row => ({
    count: parseIntFromString(row.querySelector('.table__cell:nth-child(5)').textContent) || 0,
    price: parseFloatFromString(row.querySelector('.table__cell:nth-child(6)').textContent.replace('$', '')) || 0,
  }));

  // Обновить текст итоговой стоимости
  const totalMain = document.querySelector('.cms__total-price');
  totalMain.textContent = `$ ${+getTotalSum(itemsArray).toFixed(2)}`;
};

// Закрывать модальное окно без использования методов stopImmediatePropagation и stopPropagation
overlay.addEventListener('click', e => {
  const target = e.target;

  if (target === overlay || target.closest('.modal__close')) {
    overlay.classList.remove('active');
  }
});

// Обновить порядковые номера в таблице
const updateRowNumbers = () => {
  const rows = tableBody.querySelectorAll('.item');

  rows.forEach((row, index) => {
    row.querySelector('.table__cell:first-child').textContent = index + 1;
  });
};

// Функция для добавления новой строки в таблицу
const addRowToTable = (item) => {
  const newRow = createRowElement(item);
  tableBody.appendChild(newRow);
};

// Создайте функцию renderGoods, принимает один параметр массив с объектами
// Функция renderGoods перебирает массив и вставляет строки, созданные на основе createRow, в таблицу
const renderGoods = itemsArray => {
  for (const item of itemsArray) {
    addRowToTable(item);
  }

  updateRowNumbers();
  updateTotalPriceMain();
};

// При клике на кнопку удалить в таблице, удалять строку из вёрстки и объект из базы данных
tableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('table__btn_del')) {
    const item = target.closest('.item');

    if (item) {
      // Получить ID товара для удаления
      const itemId = parseIntFromString(item.querySelector('.table__cell:nth-child(1)').textContent);

      // Удалить товар из базы данных по ID
      const index = database.findIndex(item => item.id === itemId);

      if (index !== -1) {
        database.splice(index, 1);
      }

      item.remove();

      console.log('database: ', database);

      // Обновить порядковые номера в таблице после удаления товара
      updateRowNumbers();
      // Обновить итоговую стоимость после удаления товара
      updateTotalPriceMain();
    }
  }
});

// В форме, если поставить чекбокс, должен быть разблокирован input с name discount_count
discountCheckbox.addEventListener('change', () => {
  // Если чекбокс отмечен, разблокировать поле ввода
  if (discountCheckbox.checked) {
    discountCountInput.disabled = false;
  } else {
    // Если чекбокс убрать, поле очищается и блокируется
    discountCountInput.value = '';
    discountCountInput.disabled = true;
  }
});

// Пересчёт итоговой стоимости в модальном окне
const recalculateModalPrice = () => {
  // Значения из полей Количество и Цена
  const count = parseIntFromString(countInput.value) || 0;
  const price = parseFloatFromString(priceInput.value) || 0;

  // Итоговая стоимость при добавлении товара
  const total = count * price;

  // Обновить текст итоговой стоимости в модальном окне
  const modalTotalPrice = document.querySelector('.modal__total-price');
  modalTotalPrice.textContent = `${+total.toFixed(2)}`;
};

countInput.addEventListener('input', recalculateModalPrice);
priceInput.addEventListener('input', recalculateModalPrice);

// Сериализация формы в объект FormData
const serializeForm = form => {
  const { elements } = form;
  const data = new FormData();

  [...elements]
    .filter(item => !!item.name)
    .forEach(element => {
      const { name } = element;
      const value = element.value;

      data.append(name, value);
    });

  return data;
};

// Обработчик события отправки формы
modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Загрузка данных, если они еще не загружены
  if (database.length === 0) {
    database = await fetchData();
    renderGoods(database);
  }

  // Извлечь ID из span
  const newId = parseIntFromString(vendorCodeIdSpan.textContent.replace('id: ', ''));

  // Сериализация формы
  const formData = serializeForm(e.target);

  // Добавление нового товара в базу данных
  const newItem = addToDatabase(
    newId,
    formData.get('name'),
    formData.get('category'),
    formData.get('units'),
    parseIntFromString(formData.get('count')),
    parseFloatFromString(formData.get('price')),
  );

  console.log('newItem: ', newItem);
  // console.log('database: ', database);

  // Добавить новую строку в таблицу
  addRowToTable(newItem);

  // Очистить поля формы после добавления
  modalForm.reset();
  overlay.classList.remove('active');

  // Обновить порядковые номера
  updateRowNumbers();
  // Обновить итоговую стоимость всех товаров
  updateTotalPriceMain();
});

// Отобразить товары после их добавления в базу данных
renderGoods(database);

// Обновить итоговую стоимость после загрузки страницы
window.addEventListener('load', async () => {
  database = await fetchData();
  renderGoods(database);
  updateTotalPriceMain();
});
