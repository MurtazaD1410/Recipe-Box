import { bookmarkedRecipes, myRecipes } from '@/routes';
import recipes, { byCategory } from '@/routes/recipes';
import { Category } from '@/types/types';
import { usePage } from '@inertiajs/react';

interface Props {
  categories: Category[];
  context: string;
}

const CategoryTabs = ({ categories, context = 'all' }: Props) => {
  const { url } = usePage(); // e.g. "/category/lunch"

  // Extract last segment (category slug)
  const cleanUrl = url.split('?')[0]; // "/category/breakfast"
  const currentSlug = cleanUrl.startsWith('/category/')
    ? cleanUrl.split('/').pop() // "breakfast"
    : null;

  const generateCategoryUrl = (slug: string) => {
    const baseUrl = byCategory({ category: slug }).url;
    if (context && context !== 'all') {
      return `${baseUrl}?from=${context}`;
    }
    return baseUrl;
  };

  const generateAllUrl = () => {
    switch (context) {
      case 'my-recipes':
        return myRecipes().url;
      case 'bookmarked-recipes':
        return bookmarkedRecipes().url;
      default:
        // For 'all' context or any unknown context, go to the main index
        return recipes.index().url;
    }
  };

  return (
    <ul className="flex flex-wrap gap-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
      <li className="">
        <a
          href={generateAllUrl()}
          className={`inline-block rounded-lg px-4 py-3 ${
            !currentSlug
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
          }`}
          aria-current={!currentSlug ? 'page' : undefined}
        >
          All
        </a>
      </li>
      {categories.map((category) => {
        const isActive = currentSlug === category.slug;
        return (
          <li className="">
            <a
              href={generateCategoryUrl(category.slug)}
              className={`inline-block rounded-lg px-4 py-3 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {category.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoryTabs;
