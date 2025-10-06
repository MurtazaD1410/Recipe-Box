<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Dessert',
            'Appetizer',
            'Vegan',
            'Quick & Easy',
        ];

        // Loop through them and create records in the database
        foreach ($categories as $categoryName) {
            Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName), // e.g., "Quick & Easy" -> "quick-easy"
            ]);
        }
    }

}
