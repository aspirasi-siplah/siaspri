<?php

namespace App\Http\Requests;

use App\Models\PrincipalReferenceDocument;
use Illuminate\Foundation\Http\FormRequest;

class StorePrincipalReferenceDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'principal_name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'document_number' => 'required|string|max:255',
            'program_name' => 'nullable|string|max:255',
            'category_name' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:5120',
            'status' => 'required|string|in:'.implode(',', [
                PrincipalReferenceDocument::STATUS_ACTIVE,
                PrincipalReferenceDocument::STATUS_INACTIVE,
                PrincipalReferenceDocument::STATUS_EXPIRED,
            ]),
            'expired_date' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'principal_name.required' => 'Nama Principal wajib diisi.',
            'principal_name.string' => 'Nama Principal harus berupa teks.',
            'principal_name.max' => 'Nama Principal maksimal berukuran 255 karakter.',
            'company_name.required' => 'Nama perusahaan wajib diisi.',
            'company_name.string' => 'Nama perusahaan harus berupa teks.',
            'company_name.max' => 'Nama perusahaan maksimal berukuran 255 karakter.',
            'document_number.required' => 'Nomor dokumen wajib diisi.',
            'document_number.string' => 'Nomor dokumen harus berupa teks.',
            'document_number.max' => 'Nomor dokumen maksimal berukuran 255 karakter.',
            'program_name.string' => 'Nama program harus berupa teks.',
            'program_name.max' => 'Nama program maksimal berukuran 255 karakter.',
            'category_name.string' => 'Nama kategori harus berupa teks.',
            'category_name.max' => 'Nama kategori maksimal berukuran 255 karakter.',
            'file.file' => 'File yang diunggah harus berupa berkas.',
            'file.mimes' => 'File yang diperbolehkan: pdf, jpg, jpeg, png, doc, docx.',
            'file.max' => 'Ukuran file tidak boleh lebih dari 5MB.',
            'status.required' => 'Status wajib diisi.',
            'status.string' => 'Status harus berupa teks.',
            'status.in' => 'Status yang dipilih tidak valid.',
            'expired_date.date' => 'Tanggal kedaluwarsa harus berupa tanggal yang valid.',
        ];
    }
}
