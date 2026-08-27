<?php

use App\Models\Principal;
use App\Models\PrincipalDocument;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('visitors can browse principals and their public detail', function () {
    $principal = Principal::factory()->create();
    Reseller::factory()->for($principal)->create();
    PrincipalDocument::factory()->for($principal)->create();

    $this->get(route('principals.index'))->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('principals/index-landing')->has('principals.data', 1));

    $this->get(route('principals.show', $principal))->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('principals/show-landing')->has('principal.resellers', 1)->has('principal.documents', 1));
});

test('admin can create, manage children, and soft delete a principal', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('principal-management.store'), ['name' => 'PT ASPRI'])->assertRedirect();
    $principal = Principal::firstOrFail();

    $this->post(route('principal-management.resellers.store', $principal), [
        'name' => 'PT Reseller',
        'document_number' => 'DOC-001',
        'reference_code' => 'REF-001',
    ])->assertRedirect();

    $this->post(route('principal-management.documents.store', $principal), [
        'name' => 'INTEGRITY_PACT',
        'file' => UploadedFile::fake()->create('pact.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    expect($principal->fresh()->resellers)->toHaveCount(1)
        ->and($principal->fresh()->documents->first()->name->value)->toBe('INTEGRITY_PACT');

    $this->delete(route('principal-management.destroy', $principal))->assertRedirect();
    expect($principal->fresh()->trashed())->toBeTrue();
});
