<?php

use App\Models\PrincipalReferenceDocument;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('reference-documents-management.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the reference documents index', function () {
    $user = User::factory()->create();
    PrincipalReferenceDocument::factory()->count(3)->create();

    $this->actingAs($user);

    $response = $this->get(route('reference-documents-management.index'));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reference-documents/index-reference-document')
            ->has('documents.data', 3));
});

test('admin can store a reference document with an auto generated reference id', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $payload = [
        'principal_name' => 'PT Contoh Principal',
        'document_number' => 'DOC-2026-001',
        'program_name' => 'Program Kemitraan',
        'category_name' => 'Kemitraan',
        'status' => PrincipalReferenceDocument::STATUS_ACTIVE,
        'expired_date' => '2027-01-01',
    ];

    $response = $this->post(route('reference-documents-management.store'), $payload);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $document = PrincipalReferenceDocument::first();

    expect($document)->not->toBeNull()
        ->and($document->reference_id)->toMatch('/^ASPRI-BP-\d{5}$/')
        ->and($document->principal_name)->toBe('PT Contoh Principal')
        ->and($document->status)->toBe('active');
});

test('admin can update a reference document without changing the reference id', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $document = PrincipalReferenceDocument::factory()->create();

    $response = $this->put(route('reference-documents-management.update', $document->id), [
        'principal_name' => 'PT Principal Baru',
        'document_number' => 'DOC-2026-002',
        'program_name' => 'Program Baru',
        'category_name' => 'Kemitraan Baru',
        'status' => PrincipalReferenceDocument::STATUS_INACTIVE,
        'expired_date' => '2028-05-20',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    expect($document->fresh()->reference_id)->toBe($document->reference_id)
        ->and($document->fresh()->principal_name)->toBe('PT Principal Baru')
        ->and($document->fresh()->status)->toBe('inactive');
});

test('admin can delete a reference document', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $document = PrincipalReferenceDocument::factory()->create();

    $response = $this->delete(route('reference-documents-management.destroy', $document->id));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($document);
});
