<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBlacklistMerchantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'merchant_name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'reason' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'merchant_name.required' => 'Nama merchant wajib diisi.',
            'merchant_name.string' => 'Nama merchant harus berupa teks.',
            'merchant_name.max' => 'Nama merchant maksimal berukuran 255 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'File harus berupa .jpeg, .png, .jpg, atau .webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'reason.required' => 'Alasan blacklist wajib diisi.',
            'reason.string' => 'Alasan blacklist harus berupa teks.',
        ];
    }
}
