<?php

use App\Models\Principal;
use App\Models\Reseller;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can delete a reseller without a document', function () {
    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    $reseller = Reseller::factory()->for($principal)->create(['document_path' => null]);

    $this->actingAs($user)
        ->delete(route('principal-management.resellers.destroy', [$principal, $reseller]))
        ->assertRedirect();

    expect($reseller->fresh())->toBeNull();
});

test('admin can delete a reseller and remove its document file', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    $reseller = Reseller::factory()->for($principal)->create();

    $path = Storage::disk('public')->putFile('resellers', UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'));
    $reseller->update(['document_path' => $path]);

    $this->actingAs($user)
        ->delete(route('principal-management.resellers.destroy', [$principal, $reseller]))
        ->assertRedirect();

    expect($reseller->fresh())->toBeNull()
        ->and(Storage::disk('public')->exists($path))->toBeFalse();
});

test('admin can update a reseller with a document even when it had none', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    $reseller = Reseller::factory()->for($principal)->create(['document_path' => null]);

    $this->actingAs($user)
        ->put(route('principal-management.resellers.update', [$principal, $reseller]), [
            'name' => $reseller->name,
            'file' => UploadedFile::fake()->create('later.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect();

    expect($reseller->fresh()->document_path)->not->toBeNull();
});
