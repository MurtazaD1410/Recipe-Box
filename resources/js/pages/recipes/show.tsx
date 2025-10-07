import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { bookmark } from '@/routes';
import profile from '@/routes/profile';
import recipes, { byCategory } from '@/routes/recipes';
import { BreadcrumbItem, User } from '@/types';
import { Recipe } from '@/types/types';
import { Head, router } from '@inertiajs/react';
import { Bookmark, Clock3Icon, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

const nonLinearIngredients = [
  'salt',
  'chili',
  'garam masala',
  'pepper',
  'vinegar',
  'soy sauce',
  'lemon',
  'lime',
  'ginger',
  'garlic',
];

const ShowRecipe = ({
  recipe,
  auth,
}: {
  recipe: Recipe;
  auth: { user: User };
}) => {
  const [servings, setServings] = useState(recipe.serves || 1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      href: recipes.index().url,
      title: `Recipes / ${recipe.title}`,
    },
  ];

  const handleBookmark = () => {
    router.post(bookmark(recipe.id).url);
  };

  function scaleIngredients(
    ingredients: string,
    baseServings: number,
    newServings: number,
  ) {
    const factor = newServings / baseServings;

    return ingredients.split(',').map((ingredient) => {
      const lower = ingredient.toLowerCase();
      const isStrongFlavor = nonLinearIngredients.some((flavor) =>
        lower.includes(flavor),
      );

      // Apply reduced scaling for strong flavor ingredients
      const adjustedFactor = isStrongFlavor
        ? 1 + (factor - 1) * 0.75 // e.g., doubling (2x) becomes 1.75x
        : factor;

      return ingredient.replace(/(\d+(\.\d+)?)/g, (match) => {
        const newValue = parseFloat(match) * adjustedFactor;
        return newValue % 1 === 0 ? String(newValue) : newValue.toFixed(2);
      });
    });
  }

  const handleDelete = () => {
    router.delete(recipes.destroy(recipe.id).url, {
      onSuccess: () => {
        console.log('✅ Recipe deleted successfully!');
      },
      onError: (errors) => {
        console.error('❌ Delete failed:', errors);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={recipe.title} />
      <div className="mx-auto w-full max-w-5xl space-y-4 p-4 pb-10">
        <div className="overflow-hidden rounded-lg">
          <img
            src={recipe.image_large as string}
            alt=""
            className="aspect-square items-center object-cover"
          />
        </div>
        {/* title */}
        <div className="flex flex-col space-y-3">
          <div className="flex flex-row items-center justify-between">
            <span className="text-2xl font-bold lg:text-4xl">
              {recipe.title}
            </span>

            {recipe.user.id === auth?.user?.id ? (
              <div className="flex gap-3">
                <Button variant={'outline'}>
                  <a href={recipes.edit(recipe.id).url}>Edit</a>
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={() => setShowConfirmDialog(true)}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <Button
                className=""
                onClick={handleBookmark}
                size={'icon'}
                variant={'ghost'}
              >
                <Bookmark
                  className={cn(
                    'size-6',
                    recipe.has_bookmarked ? 'fill-yellow-500' : '',
                  )}
                />
              </Button>
            )}
          </div>
          {recipe.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.categories.map((category) => {
                return (
                  <Badge
                    variant={'secondary'}
                    key={category.id}
                    className="text-sm"
                    asChild
                  >
                    <a href={byCategory(category.slug).url}>{category.name}</a>
                  </Badge>
                );
              })}
            </div>
          )}
          <div className="flex flex-row gap-5 opacity-65">
            {recipe.cooking_time && (
              <div className="flex flex-row items-center gap-1">
                <Clock3Icon className="size-5" />
                <span>{recipe.cooking_time}</span>
              </div>
            )}
            {recipe.serves && (
              <div className="flex flex-row items-center gap-1">
                <UtensilsCrossed className="size-5" />
                <span>{recipe.serves}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full border border-border"></div>
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={recipe.user.avatarPreview ?? undefined} />
            <AvatarFallback className="bg-muted-foreground">
              {recipe.user.name.split(' ')[0][0].toUpperCase()}
              {recipe.user.name.split(' ')[1][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <a
            href={profile.show(recipe.user.username).url}
            className="truncate text-sm hover:underline"
          >
            {recipe.user.name}
          </a>
        </div>
        <div className="w-full border border-border"></div>
        <div className="flex flex-col space-y-2">
          <span className="text-2xl font-medium">Ingredients</span>

          <div className="flex items-center gap-2">
            <label className="text-sm opacity-75">Servings:</label>
            <input
              style={{}}
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-16 rounded-md border px-2 py-1 text-center"
            />
          </div>

          <ul className="list-inside list-disc space-y-1">
            {/* {recipe.ingredients.split(',').map((ingredient, index) => (
              <li key={index} className="list-none opacity-80">
                {ingredient.trim()}
              </li>
            ))} */}
            {scaleIngredients(
              recipe.ingredients,
              Number(recipe.serves),
              Number(servings),
            ).map((ingredient, index) => (
              <li key={index} className="list-none opacity-80">
                {ingredient.trim()}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full border border-border"></div>
        <div className="flex flex-col space-y-2">
          <span className="text-2xl font-medium">Instructions</span>

          <p className="opacity-80">{recipe.instructions}</p>
        </div>
      </div>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleDelete}
                variant={'destructive'}
                className="text-white"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ShowRecipe;
