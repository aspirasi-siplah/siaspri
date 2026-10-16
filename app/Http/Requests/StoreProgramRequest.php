<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProgramRequest extends FormRequest
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
            'code' => ['nullable', 'string', 'max:255', 'unique:programs,code'],
            'name' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'id_fund' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.string' => 'Kode program harus berupa teks.',
            'code.max' => 'Kode program maksimal berukuran 255 karakter.',
            'code.unique' => 'Kode program sudah digunakan.',
            'name.string' => 'Nama program harus berupa teks.',
            'name.max' => 'Nama program maksimal berukuran 255 karakter.',
            'year.integer' => 'Tahun harus berupa angka.',
            'year.min' => 'Tahun tidak valid.',
            'year.max' => 'Tahun tidak valid.',
            'id_fund.string' => 'ID Fund harus berupa teks.',
            'id_fund.max' => 'ID Fund maksimal berukuran 255 karakter.',
        ];
    }
}
