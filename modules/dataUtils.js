/* eslint-disable object-curly-spacing */
export const generateRandomId = () =>
  Math.floor(Math.random() * 1000000000000000);

export const getTotalPerItem = ({ count, price }) => count * price;

export const getTotalSum = (itemsArray = []) =>
  itemsArray.reduce((acc, item) => acc + getTotalPerItem(item), 0);

export const addToDatabase = (id, title, category, units, count, price, db) => {
  const newItem = { id, title, category, units, count, price };
  const newDb = [...db, newItem];

  return { newItem, newDb };
};

export const serializeForm = (form) => {
  const { elements } = form;
  const data = new FormData();

  [...elements]
    .filter((item) => !!item.name)
    .forEach(({ name, value }) => data.append(name, value));

  return data;
};

export const removeFromDatabase = (itemId, db) => {
  const index = db.findIndex((dbItem) => dbItem.id === itemId);

  if (index !== -1) {
    const newDb = [...db.slice(0, index), ...db.slice(index + 1)];

    return { removedItem: db[index], newDb };
  }

  return { removedItem: null, newDb: db };
};
