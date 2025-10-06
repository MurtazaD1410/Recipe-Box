<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicProfileController extends Controller
{
  public function show(User $user)
  {
    $recipes = $user->recipes()->latest()->paginate(10)->through(
      fn($recipe) => $recipe->toApiArray()
    );

    $userData = [
      ...$user->toArray(),
      'avatarPreview' => $user->imageUrl('avatar'),
      'avatarLarge' => $user->imageUrl('large'),
    ];




    return Inertia::render('profile/show', ['user' => $userData, 'recipes' => $recipes]);
  }
}
