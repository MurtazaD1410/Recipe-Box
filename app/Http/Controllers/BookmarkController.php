<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function bookmark(Recipe $recipe)
    {
        $hasBookmarked = auth()->user()->hasBookmarked($recipe);
        if ($hasBookmarked) {
            $recipe->bookmarks()->where(
                "user_id",
                auth()->id()
            )->delete();
        } else {
            $recipe->bookmarks()->create([
                "user_id" => auth()->id(),
            ]);
        }

        return back();
    }
}
