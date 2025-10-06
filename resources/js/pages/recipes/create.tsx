import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import recipes from '@/routes/recipes';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';

const CreateRecipe = () => {
    const { post, data, setData, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        serves: string;
        cooking_time: string;
        ingredients: string;
        instructions: string;
        image: File | null;
    }>({
        title: '',
        serves: '',
        cooking_time: '',
        description: '',
        ingredients: '',
        instructions: '',
        image: null,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Create your Recipe',
            href: recipes.create().url,
        },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(recipes.store().url, {
            forceFormData: true,
            onSuccess: () => reset(),
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
                                    required
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

export default CreateRecipe;
