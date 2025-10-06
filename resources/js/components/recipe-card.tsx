import profile from '@/routes/profile';
import recipes from '@/routes/recipes';
import { Recipe } from '@/types/types';
import { ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

interface Props {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => {
  return (
    <div className="flex w-full flex-col justify-between overflow-hidden rounded-lg border border-border bg-accent shadow-sm lg:flex-row-reverse">
      {/* Image Section */}
      <a
        href={
          recipes.show({
            username: recipe.user.username,
            recipe: recipe.slug,
          }).url
        }
        className="relative h-64 w-full lg:h-auto lg:w-1/2"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            src={
              recipe.has_image
                ? (recipe.image_preview as string)
                : 'https://flowbite.com/docs/images/blog/image-1.jpg'
            }
            alt={recipe.title}
          />
        </div>
      </a>

      {/* Content Section */}
      <div className="flex w-full flex-col items-start justify-start gap-3 p-5 lg:w-1/2">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {recipe.title}
        </h5>
        <p className="line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
          {recipe.description}
        </p>
        <Button asChild className="w-full max-w-xs">
          <a
            href={
              recipes.show({
                username: recipe.user.username,
                recipe: recipe.slug,
              }).url
            }
          >
            Read More
            <ArrowRight className="size-4" />
          </a>
        </Button>
        {/* Posted by section */}
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-10">
            <AvatarImage src={recipe.user.avatar ?? undefined} />
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
      </div>
    </div>
  );
};

export default RecipeCard;
