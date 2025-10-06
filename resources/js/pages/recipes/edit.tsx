import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { BreadcrumbItem } from '@/types';
import { Recipe } from '@/types/types';
import { useForm } from '@inertiajs/react';

const RecipeEdit = ({ recipe }: { recipe: Recipe }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Recipe',
            href: recipes.edit(recipe.id).url,
        },
    ];

    const { post, data, setData, processing, errors } = useForm<{
        title: string;
        description: string;
        serves: string;
        cooking_time: string;
        ingredients: string;
        instructions: string;
        image: File | null;
        _method: string;
    }>({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        serves: recipe.serves || '',
        cooking_time: recipe.cooking_time || '',
        image: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        post(recipes.update(recipe.id).url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Recipe updated successfully!');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="py-6">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <Heading
                        title="Add New Recipe"
                        description="Add your recipe with the ingredients"
                    />

                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                {recipe.has_image && (
                                    <div className="overflow-hidden rounded-lg">
                                        <img
                                            src={recipe.image_large as string}
                                            alt=""
                                        />
                                    </div>
                                )}
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'image',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>
                            {/* Title Field */}
                            <div>
                                <Label htmlFor="title">Recipe Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex flex-col gap-3 md:flex-row">
                                <div className="flex-1">
                                    <Label htmlFor="serves">
                                        Serves (people)
                                    </Label>
                                    <Input
                                        id="serves"
                                        name="serves"
                                        value={data.serves}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('serves', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.title}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="cooking_time">
                                        Cooking Time
                                    </Label>
                                    <Input
                                        id="cooking_time"
                                        name="cooking_time"
                                        value={data.cooking_time}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                'cooking_time',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.title}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Description Field */}
                            <div>
                                <Label htmlFor="description">
                                    Recipe Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            {/* Ingredients Field */}
                            <div>
                                <Label htmlFor="ingredients">
                                    Recipe Ingredients
                                </Label>
                                <p className="mb-1 text-sm text-gray-500">
                                    Seperate each ingredient with a comma.
                                </p>
                                <Textarea
                                    id="ingredients"
                                    name="ingredients"
                                    value={data.ingredients}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('ingredients', e.target.value)
                                    }
                                    rows={6}
                                    required
                                />
                                <InputError
                                    message={errors.ingredients}
                                    className="mt-2"
                                />
                            </div>

                            {/* Instructions Field */}
                            <div>
                                <Label htmlFor="instructions">
                                    Recipe Instructions
                                </Label>
                                <Textarea
                                    id="instructions"
                                    name="instructions"
                                    value={data.instructions}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('instructions', e.target.value)
                                    }
                                    rows={10}
                                    required
                                />
                                <InputError
                                    message={errors.instructions}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Recipe'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default RecipeEdit;
