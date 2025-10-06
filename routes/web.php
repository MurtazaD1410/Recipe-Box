<?php

use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\PublicProfileController;
use App\Http\Controllers\RecipeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('recipes.index');
})->name('home');



Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('recipes.index');
    })->name('dashboard');
    Route::get('/recipes/create', [RecipeController::class, 'create'])->name('recipes.create');
    Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store');
    Route::get('/recipes/{recipe}/edit', [RecipeController::class, 'edit'])->name('recipes.edit');
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update'])->name('recipes.update');
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy'])->name('recipes.destroy');
    Route::get('/my-recipes', [RecipeController::class, 'myRecipes'])->name('my-recipes');
    Route::get('/bookmarked-recipes', [RecipeController::class, 'getBookmarkedRecipes'])->name('bookmarked-recipes');
    Route::post('/bookmark/{recipe}', [BookmarkController::class, 'bookmark'])->name('bookmark');
});

Route::get('/recipes', [RecipeController::class, 'index'])->name('recipes.index'); // list recipes
Route::get('/@{username}/{recipe:slug}', [RecipeController::class, 'show'])->name('recipes.show'); // view one recipe
Route::get('/@{user:username}', [PublicProfileController::class, 'show'])->name('profile.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
