<?php

namespace App\Http\Requests;

use App\Models\PrincipalReferenceDocument;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePrincipalReferenceDocumentRequest extends FormRequest
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
            'principal_name' => 'required|string|max:255',
            'document_number' => 'required|string|max:255',
            'program_name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255',
            'status' => 'required|string|in:'.implode(',', [
                PrincipalReferenceDocument::STATUS_ACTIVE,
                PrincipalReferenceDocument::STATUS_INACTIVE,
                PrincipalReferenceDocument::STATUS_EXPIRED,
            ]),
            'expired_date' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'principal_name.required' => 'Nama Principal wajib diisi.',
            'principal_name.string' => 'Nama Principal harus berupa teks.',
            'principal_name.max' => 'Nama Principal maksimal berukuran 255 karakter.',
            'document_number.required' => 'Nomor dokumen wajib diisi.',
            'document_number.string' => 'Nomor dokumen harus berupa teks.',
            'document_number.max' => 'Nomor dokumen maksimal berukuran 255 karakter.',
            'program_name.required' => 'Nama program wajib diisi.',
            'program_name.string' => 'Nama program harus berupa teks.',
            'program_name.max' => 'Nama program maksimal berukuran 255 karakter.',
            'category_name.required' => 'Nama kategori wajib diisi.',
            'category_name.string' => 'Nama kategori harus berupa teks.',
            'category_name.max' => 'Nama kategori maksimal berukuran 255 karakter.',
            'status.required' => 'Status wajib diisi.',
            'status.string' => 'Status harus berupa teks.',
            'status.in' => 'Status yang dipilih tidak valid.',
            'expired_date.required' => 'Tanggal kedaluwarsa wajib diisi.',
            'expired_date.date' => 'Tanggal kedaluwarsa harus berupa tanggal yang valid.',
        ];
    }
}
