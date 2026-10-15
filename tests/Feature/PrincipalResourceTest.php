<?php

use App\Models\Principal;
use App\Models\PrincipalDocument;
use App\Models\Program;
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

    $program = Program::factory()->create();

    $this->post(route('principal-management.store'), [
        'name' => 'PT ASPRI',
        'program_id' => $program->id,
    ])->assertRedirect();
    $principal = Principal::firstOrFail();

    expect($principal->program_id)->toBe($program->id);

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

test('program is required when storing or updating a principal', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('principal-management.store'), ['name' => 'PT ASPRI'])
        ->assertSessionHasErrors('program_id');

    $principal = Principal::factory()->create();

    $this->put(route('principal-management.update', $principal), ['name' => 'PT ASPRI'])
        ->assertSessionHasErrors('program_id');
});

test('principals can be filtered by program on the management and landing pages', function () {
    $this->actingAs(User::factory()->create());

    $programA = Program::factory()->create(['name' => 'Program A']);
    $programB = Program::factory()->create(['name' => 'Program B']);
    Principal::factory()->for($programA)->create(['name' => 'Principal A']);
    Principal::factory()->for($programB)->create(['name' => 'Principal B']);

    $this->get(route('principal-management.index', ['program_id' => $programA->id]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('principal-management/index')
            ->has('principals.data', 1)
            ->where('principals.data.0.name', 'Principal A')
            ->where('filters.program_id', $programA->id));

    $this->get(route('principals.index', ['program_id' => $programB->id]))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('principals/index-landing')
            ->has('principals.data', 1)
            ->where('principals.data.0.name', 'Principal B')
            ->where('filters.program_id', $programB->id));
});
