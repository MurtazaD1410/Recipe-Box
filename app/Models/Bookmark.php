<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    /** @use HasFactory<\Database\Factories\BookmarkFactory> */
    use HasFactory;


    public const UPDATED_AT = null;
    protected $fillable = [
        "user_id",
        "recipe_id"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
}
