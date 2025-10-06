<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show(Category $category, Request $request)
    {
        $search = $request->query('search');
        $context = $request->query('from');
        $user = auth()->user();

        // 🧠 Step 1: Choose the correct base query
        if ($context === 'my-recipes') {
            // Show only the user's own recipes from this category
            $query = $user->recipes()
                ->whereHas('categories', fn($q) => $q->where('categories.id', $category->id));
            $pageTitle = 'My Recipes in ' . $category->name;

        } elseif ($context === 'bookmarked-recipes') {
            // Show only bookmarked recipes from this category
            $query = $user->bookmarkedRecipes()
                ->whereHas('categories', fn($q) => $q->where('categories.id', $category->id));
            $pageTitle = 'Bookmarked Recipes in ' . $category->name;

        } else {
            // Default: show all recipes in category except user’s own
            $query = $category->recipes()->where('user_id', '!=', auth()->id());
            $pageTitle = $category->name . ' Recipes';
        }


        if ($search) {
            $query = $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('ingredients', 'like', "%{$search}%");
            });
        }



        // 🧠 Step 2: Load related data and paginate
        $recipes = $query
            ->with(['user', 'categories'])
            ->latest()
            ->paginate(10)
            ->through(fn($recipe) => $recipe->toApiArray($user));

        // 🧠 Step 3: Load all categories for sidebar/filter, etc.
        $categories = Category::all();

        // 🧠 Step 4: Render with context-aware data
        return Inertia::render('recipes/index', [
            'category' => $category,
            'recipes' => $recipes,
            'categories' => $categories,
            'page_title' => $pageTitle,
            'context' => $context,
            'search' => $search
        ]);
    }
}
