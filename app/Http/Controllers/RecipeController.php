<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipeRequest;
use App\Http\Requests\UpdateRecipeRequest;
use App\Models\Category;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RecipeController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {

    $recipes = Recipe::with('user', 'categories')
      ->where('user_id', '!=', auth()->id())
      ->latest()
      ->paginate(10)
      ->through(function ($recipe) {
        return [
          'id' => $recipe->id,
          'title' => $recipe->title,
          'slug' => $recipe->slug,
          'description' => $recipe->description,
          'ingredients' => $recipe->ingredients,
          'instructions' => $recipe->instructions,
          'user' => [
            ...$recipe->user->toArray(),
            'avatarPreview' => $recipe->user->imageUrl('avatar'),
            'avatarLarge' => $recipe->user->imageUrl('large'),
          ],
          'categories' => $recipe->categories->map(function ($category) {
            return [
              'id' => $category->id,
              'name' => $category->name,
              'slug' => $category->slug,
            ];
          }),
          'cooking_time' => $recipe->cooking_time,
          'serves' => $recipe->serves,
          'created_at' => $recipe->created_at,
          'updated_at' => $recipe->updated_at,
          'image_preview' => $recipe->imageUrl('preview'), // 500px
          'image_large' => $recipe->imageUrl('large'), // 1200px
          'has_image' => ($recipe->imageUrl()) !== null,
          'has_bookmarked' => auth()->user()?->hasBookmarked($recipe) ? true : false,
        ];
      });
    return Inertia::render('recipes/index', ['recipes' => $recipes, 'page_title' => 'Recipes']);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $categories = Category::all();
    return Inertia::render('recipes/create', [
      'categories' => $categories, // <-- Add this line
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreRecipeRequest $storeRecipeRequest)
  {
    $validated = $storeRecipeRequest->validated();

    DB::transaction(function () use ($validated, $storeRecipeRequest) {

      $recipe = $storeRecipeRequest->user()->recipes()->create($validated);

      if ($storeRecipeRequest->hasFile('image')) {
        $recipe->addMediaFromRequest('image')->toMediaCollection('images');
      }

      if (!empty($validated['category_ids'])) {
        $recipe->categories()->sync($validated['category_ids']);
      }
    });

    return redirect()->route('my-recipes')->with('success', 'Recipe created successfully!');
  }


  /**
   * Display the specified resource.
   */
  public function show(string $username, Recipe $recipe)
  {
    return Inertia::render('recipes/show', [
      'recipe' => [
        'id' => $recipe->id,
        'title' => $recipe->title,
        'slug' => $recipe->slug,
        'description' => $recipe->description,
        'ingredients' => $recipe->ingredients,
        'instructions' => $recipe->instructions,
        'user' => [
          ...$recipe->user->toArray(),
          'avatarPreview' => $recipe->user->imageUrl('avatar'),
          'avatarLarge' => $recipe->user->imageUrl('large'),
        ],
        'categories' => $recipe->categories->map(function ($category) {
          return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
          ];
        }),
        'cooking_time' => $recipe->cooking_time,
        'serves' => $recipe->serves,
        'created_at' => $recipe->created_at,
        'image_preview' => $recipe->imageUrl('preview'),
        'image_large' => $recipe->imageUrl('large'),
        'has_image' => ($recipe->imageUrl()) !== null,
        'has_bookmarked' => auth()->user()?->hasBookmarked($recipe) ? true : false,
      ],
      'auth' => [
        'user' => auth()->user() ? auth()->user() : null
      ]
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Recipe $recipe)
  {
    if ($recipe->user_id != Auth::user()->id) {
      abort(403);
    }

    $categories = Category::all();

    return Inertia::render('recipes/edit', [
      'recipe' => [
        'id' => $recipe->id,
        'title' => $recipe->title,
        'slug' => $recipe->slug,
        'description' => $recipe->description,
        'ingredients' => $recipe->ingredients,
        'instructions' => $recipe->instructions,
        'user' => $recipe->user,
        'cooking_time' => $recipe->cooking_time,
        'serves' => $recipe->serves,
        'categories' => $recipe->categories->map(function ($category) {
          return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
          ];
        }),
        'created_at' => $recipe->created_at,
        'image_preview' => $recipe->imageUrl('preview'),
        'image_large' => $recipe->imageUrl('large'),
        'has_image' => ($recipe->imageUrl()) !== null,
        'has_bookmarked' => auth()->user()->hasBookmarked($recipe) ? true : false,
      ],
      'auth' => [
        'user' => auth()->user() ? auth()->user() : null
      ],
      'categories' => $categories,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateRecipeRequest $updateRecipeRequest, Recipe $recipe)
  {
    if ($recipe->user_id != Auth::user()->id) {
      abort(403);
    }

    $data = $updateRecipeRequest->validated();

    DB::transaction(function () use ($data, $updateRecipeRequest, $recipe) {

      $recipe->update($data);

      if ($updateRecipeRequest->hasFile('image')) {
        $recipe->clearMediaCollection('images');

        $recipe->addMediaFromRequest('image')->toMediaCollection('images');
      }

      if ($updateRecipeRequest->has('category_ids')) {
        $recipe->categories()->sync($updateRecipeRequest->input('category_ids', []));
      } else {
        $recipe->categories()->detach();
      }

    });

    return redirect()->route('my-recipes')->with('success', 'Recipe updated successfully!');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Recipe $recipe)
  {
    if ($recipe->user_id != Auth::user()->id) {
      abort(403);
    }
    $recipe->delete();

    return redirect()->route('my-recipes')->with('success', 'Recipe deleted successfully.');
  }

  public function myRecipes()
  {
    $user = auth()->user();

    $query = $user->recipes()->with(['user', 'media', 'categories'])->latest();

    $recipes = $query->paginate(10)
      ->through(function ($recipe) {
        return [
          'id' => $recipe->id,
          'title' => $recipe->title,
          'slug' => $recipe->slug,
          'description' => $recipe->description,
          'ingredients' => $recipe->ingredients,
          'instructions' => $recipe->instructions,
          'user' => [
            ...$recipe->user->toArray(),
            'avatarPreview' => $recipe->user->imageUrl('avatar'),
            'avatarLarge' => $recipe->user->imageUrl('large'),
          ],
          'categories' => $recipe->categories->map(function ($category) {
            return [
              'id' => $category->id,
              'name' => $category->name,
              'slug' => $category->slug,
            ];
          }),
          'cooking_time' => $recipe->cooking_time,
          'serves' => $recipe->serves,
          'created_at' => $recipe->created_at,
          'updated_at' => $recipe->updated_at,
          'image_preview' => $recipe->imageUrl('preview'), // 500px
          'image_large' => $recipe->imageUrl('large'), // 1200px
          'has_image' => ($recipe->imageUrl()) !== null,
          'has_bookmarked' => auth()->user()->hasBookmarked($recipe) ? true : false,

        ];
      });

    return Inertia::render('recipes/index', ['recipes' => $recipes, 'page_title' => 'My Recipes']);
  }

  public function getBookmarkedRecipes()
  {

    $user = auth()->user();
    $recipes = $user
      ->bookmarkedRecipes()  // Get recipes directly, not bookmarks
      ->with('user')
      ->latest('bookmarks.created_at')
      ->paginate(10)
      ->through(function ($recipe) {  // Now $recipe is actually a Recipe model
        return [
          'id' => $recipe->id,
          'title' => $recipe->title,
          'description' => $recipe->description,
          'ingredients' => $recipe->ingredients,
          'instructions' => $recipe->instructions,
          'user' => [
            ...$recipe->user->toArray(),
            'avatarPreview' => $recipe->user->imageUrl('avatar'),
            'avatarLarge' => $recipe->user->imageUrl('large'),
          ],
          'cooking_time' => $recipe->cooking_time,
          'serves' => $recipe->serves,
          'created_at' => $recipe->created_at,
          'updated_at' => $recipe->updated_at,
          'image_preview' => $recipe->imageUrl('preview'),
          'image_large' => $recipe->imageUrl('large'),
          'has_image' => $recipe->imageUrl() !== null,
          'has_bookmarked' => true,
        ];
      });


    return Inertia::render('recipes/index', ['recipes' => $recipes, 'page_title' => 'Bookmarked Recipes']);
  }
}
