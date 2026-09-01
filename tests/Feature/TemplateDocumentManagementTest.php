<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
    $this->jsonPath = storage_path('app/template-documents.json');
    if (File::exists($this->jsonPath)) {
        File::delete($this->jsonPath);
    }
});

afterEach(function () {
    if (File::exists($this->jsonPath)) {
        File::delete($this->jsonPath);
    }
    if (File::exists(storage_path('app/public/template-documents'))) {
        File::deleteDirectory(storage_path('app/public/template-documents'));
    }
});

test('guests are redirected to the login page', function () {
    $this->get(route('template-documents-management.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the template documents index', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('template-documents-management.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('template-documents/index-template-document')
            ->has('documents'));
});

test('admin can store a template document', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $file = UploadedFile::fake()->create('template-1.pdf', 100, 'application/pdf');

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => $file,
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);

    expect($documents)->toHaveCount(1)
        ->and($documents[0]['label'])->toBe('SURAT_PERNYATAAN')
        ->and($documents[0]['file_name'])->toBe('SURAT_PERNYATAAN.pdf');

    Storage::disk('public')->assertExists($documents[0]['file_path']);
});

test('admin can store a template document without a file gets validation error', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
    ])->assertSessionHasErrors('file');
});

test('uploading the same label replaces the existing file', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $file = UploadedFile::fake()->create('template-1.pdf', 100, 'application/pdf');
    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => $file,
    ])->assertRedirect();

    $oldPath = json_decode(File::get($this->jsonPath), true)[0]['file_path'];
    Storage::disk('public')->assertExists($oldPath);

    $newFile = UploadedFile::fake()->create('template-2.pdf', 200, 'application/pdf');
    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => $newFile,
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);

    expect($documents)->toHaveCount(1)
        ->and($documents[0]['file_path'])->toBe($oldPath);

    Storage::disk('public')->assertExists($oldPath);
});

test('a different label creates a separate document', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_DUKUNGAN',
        'file' => UploadedFile::fake()->create('b.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);

    expect($documents)->toHaveCount(2)
        ->and($documents[0]['file_name'])->toBe('SURAT_PERNYATAAN.pdf')
        ->and($documents[1]['file_name'])->toBe('SURAT_DUKUNGAN.pdf');
});

test('an invalid label gets a validation error', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'LABEL_TIDAK_ADA',
        'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors('label');
});

test('admin can update a template document label', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $id = json_decode(File::get($this->jsonPath), true)[0]['id'];

    $this->post(route('template-documents-management.update', $id), [
        'label' => 'SURAT_DUKUNGAN',
        '_method' => 'PUT',
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);

    expect($documents)->toHaveCount(1)
        ->and($documents[0]['label'])->toBe('SURAT_DUKUNGAN');
});

test('admin can update a template document with a new file', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $id = json_decode(File::get($this->jsonPath), true)[0]['id'];
    $oldPath = json_decode(File::get($this->jsonPath), true)[0]['file_path'];

    $this->post(route('template-documents-management.update', $id), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => UploadedFile::fake()->create('b.pdf', 200, 'application/pdf'),
        '_method' => 'PUT',
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);

    expect($documents)->toHaveCount(1)
        ->and($documents[0]['file_name'])->toBe('SURAT_PERNYATAAN.pdf');

    Storage::disk('public')->assertExists($oldPath);
});

test('admin can delete a template document', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('template-documents-management.store'), [
        'label' => 'SURAT_PERNYATAAN',
        'file' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $documents = json_decode(File::get($this->jsonPath), true);
    $id = $documents[0]['id'];
    $filePath = $documents[0]['file_path'];

    $this->delete(route('template-documents-management.destroy', $id))->assertRedirect();

    expect(json_decode(File::get($this->jsonPath), true))->toBe([]);
    Storage::disk('public')->assertMissing($filePath);
});

test('public users can download a template document', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $realPath = 'template-documents/download.pdf';
    File::ensureDirectoryExists(storage_path('app/public/template-documents'));
    File::put(storage_path('app/public/'.$realPath), 'template content');

    File::put($this->jsonPath, json_encode([
        [
            'id' => 'some-id',
            'label' => 'Form',
            'file_name' => 'download.pdf',
            'file_path' => $realPath,
            'created_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    $this->get(route('template-documents.download', 'some-id'))
        ->assertOk()
        ->assertDownload('download.pdf');
});

test('download returns 404 for a missing document', function () {
    $this->get(route('template-documents.download', 'non-existing-id'))
        ->assertNotFound();
});
