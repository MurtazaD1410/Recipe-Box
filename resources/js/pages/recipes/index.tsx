import CategoryTabs from '@/components/category-tabs';
import Pagination from '@/components/pagination';
import RecipeCard from '@/components/recipe-card';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { BreadcrumbItem } from '@/types';
import { Category, RecipePaginatedResults } from '@/types/types';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import { BookMarked, BookTextIcon, PlusSquare, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const RecipeIndex = ({
  recipes: recipesList,
  categories,
  context,
  page_title,
  search,
}: {
  recipes: RecipePaginatedResults;
  categories: Category[];
  context: string;
  page_title: string;
  search?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState('helloo');
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: page_title,
      href: recipes.index().url,
    },
  ];

  useEffect(() => {
    setSearchQuery(search || '');
  }, [search]);

  // function onSearchSubmit(query: string) {
  //   switch (context) {
  //     case 'my-recipes':
  //       return Inertia.get(
  //         myRecipes().url,
  //         { search: query },
  //         { preserveState: true },
  //       );
  //     case 'bookmarked-recipes':
  //       return Inertia.get(
  //         bookmarkedRecipes().url,
  //         { search: query },
  //         { preserveState: true },
  //       );
  //     default:
  //       Inertia.get(
  //         recipes.index().url,
  //         { search: query },
  //         { preserveState: true },
  //       );
  //   }
  // }
  function onSearchSubmit(query: string) {
    const currentUrl = window.location.pathname;
    const currentParams = new URLSearchParams(window.location.search);

    // Add/update the search query
    currentParams.set('search', query);

    Inertia.get(
      `${currentUrl}?${currentParams.toString()}`,
      {},
      { preserveState: true },
    );
  }

  const formatLabel = (text: string) =>
    text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={page_title} />
      <div className="space-y-4 p-4 pb-10">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">
            {page_title === 'Category' && context && context !== 'all'
              ? formatLabel(context)
              : page_title}
          </span>
          {(page_title === 'My Recipes' || context === 'my-recipes') && (
            <Button asChild>
              <a href={'/recipes/create'}>
                <PlusSquare className="size-4" />
                Create Recipe
              </a>
            </Button>
          )}
        </div>
        <div className="flex flex-row gap-4">
          <Input
            className="flex-1"
            value={searchQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit(searchQuery);
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            className="w-full max-w-[200px]"
            variant={'outline'}
            onClick={() => onSearchSubmit(searchQuery)}
          >
            <Search />
            Search
          </Button>
        </div>
        <CategoryTabs categories={categories} context={context} />
        {(recipesList.data ?? []).length > 0 ? (
          <div className="4xl:grid-cols-3 grid grid-cols-1 gap-4 overflow-x-auto rounded-xl xl:grid-cols-2">
            {(recipesList?.data ?? []).map((recipe) => (
              <>
                <RecipeCard recipe={recipe} key={recipe.id} />
              </>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {page_title === 'Bookmarked Recipes' ? (
                    <BookMarked />
                  ) : (
                    <BookTextIcon />
                  )}
                </EmptyMedia>
                <EmptyTitle>
                  {page_title === 'Bookmarked Recipes'
                    ? 'Bookmark recipes to see them here'
                    : 'No Recipes Listed'}
                </EmptyTitle>
                <EmptyDescription>
                  {page_title === 'Bookmarked Recipes'
                    ? 'Find your bookmarked recipes easily here!!'
                    : 'Start uploading recipes today!!'}
                </EmptyDescription>
              </EmptyHeader>

              {/* Only show button if page_title is NOT "Recipes" */}
              {page_title === 'My Recipes' && (
                <EmptyContent>
                  <Button variant="outline" asChild size="sm">
                    <a href={recipes.create().url}>Create Recipe</a>
                  </Button>
                </EmptyContent>
              )}
            </Empty>
          </div>
        )}
        <Pagination pagination={recipesList} />
      </div>
    </AppLayout>
  );
};

export default RecipeIndex;
