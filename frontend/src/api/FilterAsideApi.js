import { fetchCategories, fetchBrands } from './Category';
import { fetchColors } from './Colors';

const Product_API_URL = import.meta.env.VITE_API_URL + '/customer-products/' ;

export const fetchFiltersData = async () => {
  try {
    const [categoriesData, brandsData, colorsData, productsData] = await Promise.all([
      fetchCategories(),
      fetchBrands(),
      fetchColors(),
      fetch(Product_API_URL).then((res) => res.json())
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
    console.log();
    throw error;
  }
};
