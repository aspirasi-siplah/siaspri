<?php

namespace App\Imports;

use App\Models\Reseller;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ResellersImport implements SkipsEmptyRows, SkipsOnFailure, ToModel, WithHeadingRow, WithValidation
{
    use SkipsFailures;

    public int $importedCount = 0;

    /**
     * @var array<int, string>
     */
    private array $usedReferenceCodes = [];

    /**
     * @var array<int, string>
     */
    private array $documentFiles = [];

    public function __construct(private readonly int $principalId) {}

    /**
     * The heading row of the template is on row 2, so data starts at row 3.
     */
    public function headingRow(): int
    {
        return 2;
    }

    public function model(array $row): ?Reseller
    {
        $name = $this->value($row, 'nama_reseller', 'name');

        if ($name === '') {
            return null;
        }

        $referenceCode = $this->generateUniqueReferenceCode($name);

        $documentFile = $this->nullableValue($row, 'nama_file_dokumen', 'document_file');
        if ($documentFile !== null) {
            $this->documentFiles[$referenceCode] = $documentFile;
        }

        $this->importedCount++;

        return new Reseller([
            'principal_id' => $this->principalId,
            'name' => $name,
            'npwp_number' => $this->nullableValue($row, 'npwp'),
            'document_number' => $this->nullableValue($row, 'nomor_dokumen'),
            'reference_code' => $referenceCode,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_reseller' => ['required', 'string', 'max:255'],
            'npwp' => ['nullable', 'max:255'],
            'nomor_dokumen' => ['nullable', 'max:255'],
            'nama_file_dokumen' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nama_reseller.required' => 'Kolom Nama Reseller wajib diisi.',
            'nama_reseller.string'   => 'Kolom Nama Reseller harus berupa teks.',
            'nama_reseller.max'      => 'Kolom Nama Reseller maksimal :max karakter.',
            'npwp.max'               => 'Kolom NPWP maksimal :max karakter.',
            'nomor_dokumen.max'      => 'Kolom Nomor Dokumen maksimal :max karakter.',
            'nama_file_dokumen.max'  => 'Kolom Nama File Dokumen maksimal :max karakter.',
        ];
    }

    public function customValidationAttributes(): array
    {
        return [
            'nama_reseller'     => 'Nama Reseller',
            'npwp'              => 'NPWP',
            'nomor_dokumen'     => 'Nomor Dokumen',
            'nama_file_dokumen' => 'Nama File Dokumen',
        ];
    }

    public function getDocumentFiles(): array
    {
        return $this->documentFiles;
    }

    public function getImportIssues(): array
    {
        $issues = [];

        foreach ($this->failures() as $failure) {
            $issues[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
            ];
        }

        return $issues;
    }

    private function value(array $row, string $slugKey, string $fallbackKey = ''): string
    {
        $value = $row[$slugKey] ?? ($fallbackKey !== '' ? ($row[$fallbackKey] ?? null) : null);

        return trim((string) ($value ?? ''));
    }

    private function nullableValue(array $row, string $slugKey, string $fallbackKey = ''): ?string
    {
        $value = $row[$slugKey] ?? ($fallbackKey !== '' ? ($row[$fallbackKey] ?? null) : null);

        if ($value === null || trim((string) $value) === '') {
            return null;
        }

        return is_numeric($value) ? number_format((float) $value, 0, '', '') : trim((string) $value);
    }

    private function generateUniqueReferenceCode(string $name): string
    {
        do {
            $code = Reseller::generateReferenceCode($name);
        } while (in_array($code, $this->usedReferenceCodes, true));

        $this->usedReferenceCodes[] = $code;

        return $code;
    }
}
