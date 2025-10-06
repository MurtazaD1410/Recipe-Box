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
  public function index(Request $request)
  {

    $search = $request->query('search');
    $query = Recipe::with('user', 'categories')
      ->where('user_id', '!=', auth()->id())
      ->latest();

    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('ingredients', 'like', "%{$search}%");
      });
    }

    $recipes = $query->paginate(10)
      ->through(fn($recipe) => $recipe->toApiArray());


    $categories = Category::all();
    return Inertia::render('recipes/index', [
      'recipes' => $recipes,
      'categories' => $categories,
      'page_title' => 'Recipes',
      'context' => 'all',
      'search' => $search
    ]);
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
      'recipe' => $recipe->toApiArray(),
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
      'recipe' => $recipe->toApiArray(),
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

  public function myRecipes(Request $request)
  {
    $user = auth()->user();
    $search = $request->query('search');

    $query = $user->recipes()->with(['user', 'media', 'categories'])->latest();
    $categories = Category::all();

    if ($search) {
      $query = $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('ingredients', 'like', "%{$search}%");
      });
    }


    $recipes = $query->paginate(10)
      ->through(fn($recipe) => $recipe->toApiArray());

    return Inertia::render('recipes/index', [
      'recipes' => $recipes,
      'categories' => $categories,
      'page_title' => 'My Recipes',
      'context' => 'my-recipes',
      'search' => $search
    ]);
  }

  public function getBookmarkedRecipes(Request $request)
  {

    $search = $request->query('search');
    $user = auth()->user();
    $categories = Category::all();

    $query = $user
      ->bookmarkedRecipes()  // Get recipes directly, not bookmarks
      ->with('user')
      ->latest('bookmarks.created_at');


    if ($search) {
      $query = $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('ingredients', 'like', "%{$search}%");
      });
    }

    $recipes = $query
      ->paginate(10)
      ->through(fn($recipe) => $recipe->toApiArray());


    return Inertia::render('recipes/index', [
      'recipes' => $recipes,
      'categories' => $categories,
      'page_title' => 'Bookmarked Recipes',
      'context' => 'bookmarked-recipes',
      'search' => $search
    ]);
  }
}
