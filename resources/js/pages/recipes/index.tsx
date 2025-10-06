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
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { BreadcrumbItem } from '@/types';
import { RecipePaginatedResults } from '@/types/types';

import { Head } from '@inertiajs/react';
import { BookMarked, BookTextIcon, PlusSquare } from 'lucide-react';

const RecipeIndex = ({
    recipes: recipesList,
    page_title,
}: {
    recipes: RecipePaginatedResults;
    page_title: string;
}) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: page_title,
            href: recipes.index().url,
        },
    ];

    console.log(recipesList);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={page_title} />
            <div className="space-y-4 p-4">
                <div className="flex justify-between">
                    <span className="text-2xl font-bold">{page_title}</span>
                    {page_title === 'My Recipes' && (
                        <Button asChild>
                            <a href={'/recipes/create'}>
                                <PlusSquare className="size-4" />
                                Create Recipe
                            </a>
                        </Button>
                    )}
                </div>
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
                                        <a href={recipes.create().url}>
                                            Create Recipe
                                        </a>
                                    </Button>
                                </EmptyContent>
                            )}
                        </Empty>
                    </div>
                )}
            </div>
            <Pagination pagination={recipesList} />
        </AppLayout>
    );
};

export default RecipeIndex;
