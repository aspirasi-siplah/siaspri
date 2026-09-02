<?php

use App\Models\Principal;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

test('admin can visit the bulk import reseller page', function () {
    $user = User::factory()->create();
    $principal = Principal::factory()->create();

    $this->actingAs($user)
        ->get(route('principal-management.resellers.import', $principal))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('principal-management/reseller-import')
            ->where('principal.id', $principal->id)
            ->where('principal.name', $principal->name));
});

test('admin can bulk import resellers from the template', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    $path = buildTemplateXlsx([
        ['PT Contoh Reseller', '123456789012345', 'DOC-001', null],
    ]);

    $this->actingAs($user)
        ->post(route('principal-management.resellers.import.store', $principal), [
            'file' => new UploadedFile($path, 'resellers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true),
        ])
        ->assertRedirect();

    expect($principal->fresh()->resellers)->toHaveCount(1)
        ->and($principal->fresh()->resellers->first()->name)->toBe('PT Contoh Reseller')
        ->and($principal->fresh()->resellers->first()->npwp_number)->toBe('123456789012345')
        ->and($principal->fresh()->resellers->first()->document_number)->toBe('DOC-001')
        ->and($principal->fresh()->resellers->first()->document_path)->toBeNull();
});

test('admin can bulk import resellers together with their document files from a zip', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    $path = buildTemplateXlsx([
        ['PT Contoh Reseller', '123456789012345', 'DOC-001', 'dokumen-reseller.pdf'],
    ]);

    $zipPath = tempnam(sys_get_temp_dir(), 'rzip_').'.zip';
    $zip = new ZipArchive;
    $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    $docContent = 'dummy reseller document content';
    $zip->addFromString('dokumen-reseller.pdf', $docContent);
    $zip->close();

    $this->actingAs($user)
        ->post(route('principal-management.resellers.import.store', $principal), [
            'file' => new UploadedFile($path, 'resellers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true),
            'document_zip' => new UploadedFile($zipPath, 'dokumen.zip', 'application/zip', null, true),
        ])
        ->assertRedirect();

    $reseller = $principal->fresh()->resellers->first();

    expect($principal->fresh()->resellers)->toHaveCount(1)
        ->and($reseller->name)->toBe('PT Contoh Reseller')
        ->and($reseller->document_path)->not->toBeNull();

    Storage::disk('public')->assertExists($reseller->document_path);
    expect(Storage::disk('public')->get($reseller->document_path))->toBe($docContent);
});

test('bulk import validates the uploaded file', function () {
    $user = User::factory()->create();
    $principal = Principal::factory()->create();

    $this->actingAs($user)
        ->post(route('principal-management.resellers.import.store', $principal), [
            'file' => UploadedFile::fake()->create('not-a-file.txt', 100),
        ])
        ->assertSessionHasErrors('file')
        ->assertRedirect();

    expect($principal->fresh()->resellers)->toHaveCount(0);
});

test('admin can download the bulk import template', function () {
    $user = User::factory()->create();
    $principal = Principal::factory()->create();

    $this->actingAs($user)
        ->get(route('principal-management.resellers.import.template', $principal))
        ->assertSuccessful()
        ->assertDownload('reseller-import-template.xlsx');
});

/**
 * Build an xlsx file matching the urgent template layout:
 * row 1 = title, row 2 = headings (Indonesian), data starting row 3.
 */
function buildTemplateXlsx(array $rows): string
{
    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();

    $sheet->setCellValue('A1', 'Data Reseller');
    $sheet->fromArray(['Nama Reseller', 'NPWP', 'Nomor Dokumen', 'Nama File Dokumen'], null, 'A2');

    $rowIndex = 3;
    foreach ($rows as $row) {
        $sheet->fromArray($row, null, 'A'.$rowIndex);
        $rowIndex++;
    }

    $path = tempnam(sys_get_temp_dir(), 'xlsx_').'.xlsx';
    (new Xlsx($spreadsheet))->save($path);

    return $path;
}
