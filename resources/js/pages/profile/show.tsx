import RecipeCard from '@/components/recipe-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { RecipePaginatedResults } from '@/types/types';
import { Frown } from 'lucide-react';

const ProfileShow = ({
  user,
  recipes: recipesList,
}: {
  user: User;
  recipes: RecipePaginatedResults;
}) => {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: `@${user.username}`,
      href: '',
    },
  ];

  console.log(user);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="h-full space-y-4 p-4">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">{user.name}</span>
        </div>

        {(recipesList.data ?? []).length > 0 ? (
          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            <div className="grid flex-2/3 grid-cols-1 gap-4 overflow-x-auto rounded-xl">
              {(recipesList?.data ?? []).map((recipe) => (
                <>
                  <RecipeCard recipe={recipe} key={recipe.id} />
                </>
              ))}
            </div>
            <div className="border-l border-border"></div>
            <div className="flex flex-1/3 flex-col gap-4">
              {user.avatarLarge && (
                <Avatar className="size-52">
                  <AvatarImage src={user.avatarLarge} />
                  <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col">
                <span className="text-lg font-medium">{user.name}</span>
                <span className="text-muted-foreground">{user.email}</span>
                <span className="text-sm">{user.bio}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Frown />
                </EmptyMedia>
                <EmptyTitle>{user.name}&apos;s Recipes</EmptyTitle>
                <EmptyDescription>
                  This user has not uploaded any recipes yet
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfileShow;
