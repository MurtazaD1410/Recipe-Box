<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRecipeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'ingredients' => ['required', 'string'],
            'instructions' => ['required', 'string'],
            'serves' => ['required', 'string'],
            'cooking_time' => ['required', 'string'],
            'image' => [
                'nullable',
                'mimes:jpeg,jpg,png,gif,svg',
                'image',
                'max:2048',
            ],
        ];
    }
}
