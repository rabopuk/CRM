export const URL = 'https://lava-cobalt-manicure.glitch.me/api/goods';

export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('database:', data);

    return [...data.goods];
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);

    return [];
  }
};
