<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class User extends Authenticatable implements HasMedia
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable, TwoFactorAuthenticatable, InteractsWithMedia;

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $fillable = [
    'name',
    'username',
    'bio',
    'email',
    'password',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  public function registerMediaConversions(?Media $media = null): void
  {
    $this
      ->addMediaConversion('avatar')
      ->width(128)
      ->crop(128, 128, )->nonQueued();


    $this->addMediaConversion('large')
      ->width(1200)
      ->crop(1200, 1200, )->nonQueued();
  }
  public function registerMediaCollections(): void
  {
    $this->addMediaCollection('avatar')->singleFile();

  }

  public function imageUrl($conversionName = '')
  {

    $media = $this->getFirstMedia('avatar');
    if (!$media) {
      return null;
    }
    if ($media->hasGeneratedConversion($conversionName)) {
      return $media?->getUrl($conversionName);
    }

    return $this->getFirstMediaUrl();
  }

  public function recipes()
  {
    return $this->hasMany(Recipe::class);
  }

  public function bookmarks()
  {
    return $this->hasMany(Bookmark::class);
  }

  public function hasBookmarked(Recipe $recipe)
  {
    return $recipe->bookmarks()->where('user_id', $this->id)->exists();
  }

  public function bookmarkedRecipes(): BelongsToMany
  {
    return $this->belongsToMany(Recipe::class, 'bookmarks', 'user_id', 'recipe_id');
  }

}
