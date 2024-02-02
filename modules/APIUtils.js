export const fetchData = async () => {
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
