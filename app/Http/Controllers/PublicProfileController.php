<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProfileController extends Controller
{
  public function show(User $user)
  {
    $recipes = $user->recipes()->latest()->paginate(10)->through(function ($recipe) {
      return [
        'id' => $recipe->id,
        'title' => $recipe->title,
        'slug' => $recipe->slug,
        'description' => $recipe->description,
        'ingredients' => $recipe->ingredients,
        'instructions' => $recipe->instructions,
        // 'user' => $recipe->user,
        'user' => [
          ...$recipe->user->toArray(),
          'avatarPreview' => $recipe->user->imageUrl('avatar'),
          'avatarLarge' => $recipe->user->imageUrl('large'),
        ],
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

    $userData = [
      ...$user->toArray(),
      'avatarPreview' => $user->imageUrl('avatar'),
      'avatarLarge' => $user->imageUrl('large'),
    ];




    return Inertia::render('profile/show', ['user' => $userData, 'recipes' => $recipes]);
  }
}
