import { fetchCategories, fetchBrands } from './Category';
import { fetchColors } from './Colors';

export const fetchFiltersData = async () => {
  try {
    const [categoriesData, brandsData, colorsData, productsData] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
      fetchColors(),
      fetch('http://127.0.0.1:8000/api/customer-products/').then((res) => res.json())
    ]);

    const categoryProductCount = categoriesData.map(category => {
      const productCount = productsData.filter(product => product.category.id === category.id).length;
      return { ...category, productCount };
    });

    return {
      categories: categoryProductCount,
      brands: brandsData,
      colors: colorsData
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
