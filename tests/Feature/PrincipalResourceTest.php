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
        ->assertInertia(fn (Assert $page) => $page
            ->component('principals/show-landing')
            ->has('principal.resellers.data', 1)
            ->has('principal.resellers.data.0.reference_link')
            ->where('principal.resellers_total', 1)
            ->missing('principal.documents')
            ->missing('principal.npwp_number')
            ->missing('principal.nib')
            ->missing('principal.resellers.data.0.npwp_number')
            ->missing('principal.resellers.data.0.document_path'));

    $this->get(route('principals.show', $principal).'?search=notfound')->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('principals/show-landing')
            ->has('principal.resellers.data', 0));

    $reseller = Reseller::first();

    $this->get(route('resellers.show', $reseller->reference_code))->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('resellers/show-landing')
            ->has('reseller.id'));
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
    ])->assertRedirect();

    $this->post(route('principal-management.documents.store', $principal), [
        'name' => 'INTEGRITY_PACT',
        'file' => UploadedFile::fake()->create('pact.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $reseller = $principal->fresh()->resellers->first();
    expect($principal->fresh()->resellers)->toHaveCount(1)
        ->and($principal->fresh()->documents->first()->name->value)->toBe('INTEGRITY_PACT')
        ->and($reseller->reference_code)->toMatch('/^ASPRI-[A-Z]+-\d{5}$/')
        ->and($reseller->reference_link)->toBe(route('resellers.show', $reseller->reference_code));

    $this->delete(route('principal-management.destroy', $principal))->assertRedirect();
    expect($principal->fresh()->trashed())->toBeTrue();
});
