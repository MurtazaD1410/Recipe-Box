<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Recipe extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;
    use InteractsWithMedia;
    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'ingredients',
        'instructions',
        'serves',
        'cooking_time',
        'user_id',
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this
            ->addMediaConversion('preview')
            ->width(500)->nonQueued();

        $this->addMediaConversion('large')
            ->width(1200)->nonQueued();

    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')->singleFile()->useDisk('public');
    }



    public function imageUrl($conversionName = '')
    {

        $media = $this->getFirstMedia('images');
        if (!$media) {
            return null;
        }
        if ($media->hasGeneratedConversion($conversionName)) {
            return $media?->getUrl($conversionName);
        }

        return $this->getFirstMediaUrl();
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

}
