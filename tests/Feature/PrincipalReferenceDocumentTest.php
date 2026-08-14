<?php

use App\Models\PrincipalReferenceDocument;
use Inertia\Testing\AssertableInertia as Assert;

test('visitors can view the reference documents index', function () {
    PrincipalReferenceDocument::factory()->count(3)->create();

    $response = $this->get(route('reference-documents.index'));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reference-documents/index')
            ->has('documents.data', 3));
});

test('visitors can view the reference document detail', function () {
    $document = PrincipalReferenceDocument::factory()->create();

    $response = $this->get(route('reference-documents.show', $document->reference_id));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reference-documents/show')
            ->where('document.reference_id', $document->reference_id)
            ->where('document.reference_link', route('reference-documents.verify', $document->reference_id)));
});

test('visitors can verify a reference document via the reference link', function () {
    $document = PrincipalReferenceDocument::factory()->create();

    $response = $this->get(route('reference-documents.verify', $document->reference_id));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reference-documents/verify')
            ->where('document.reference_id', $document->reference_id));
});

test('show and verify return 404 for unknown reference id', function () {
    $response = $this->get(route('reference-documents.show', 'REF-TIDAK-ADA'));
    $response->assertNotFound();

    $response = $this->get(route('reference-documents.verify', 'REF-TIDAK-ADA'));
    $response->assertNotFound();
});
