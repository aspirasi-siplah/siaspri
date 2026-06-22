<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
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
            'title' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'documents' => 'nullable|array',
            'documents.*.name' => 'nullable|string',
            'documents.*.file' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul berita harus diisi',
            'content.required' => 'Isi berita harus diisi',
            'status.required' => 'Status berita harus diisi',
            'status.in' => 'Status berita harus "draft" atau "published"',
            'thumbnail.image' => 'Thumbnail harus berupa gambar',
            'thumbnail.max' => 'Thumbnail maksimal berukuran 2MB',
            'documents.*.file.image' => 'Dokumen harus berupa gambar',
            'documents.*.file.mimes' => 'Dokumen harus berupa .jpeg, .png, .jpg, atau .webp',
            'documents.*.file.max' => 'Dokumen maksimal berukuran 2MB',
            'documents.*.name.string' => 'Nama dokumen harus berupa string',
        ];
    }
}
