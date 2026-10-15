<?php

use App\Models\Principal;
use App\Models\Program;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('programs-management.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the programs index', function () {
    $user = User::factory()->create();
    Program::factory()->count(3)->create();

    $this->actingAs($user);

    $response = $this->get(route('programs-management.index'));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('programs-management/index')
            ->has('programs.data', 3));
});

test('admin can store a program', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('programs-management.store'), [
        'code' => 'PRG-2026-001',
        'name' => 'Program Bantuan Pemerintah',
        'year' => 2026,
        'id_fund' => '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $program = Program::first();

    expect($program)->not->toBeNull()
        ->and($program->code)->toBe('PRG-2026-001')
        ->and($program->name)->toBe('Program Bantuan Pemerintah')
        ->and($program->year)->toBe(2026)
        ->and($program->id_fund)->toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
});

test('program code must be unique', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Program::factory()->create(['code' => 'PRG-2026-001']);

    $this->post(route('programs-management.store'), [
        'code' => 'PRG-2026-001',
        'name' => 'Program Lain',
        'year' => 2026,
    ])->assertSessionHasErrors('code');
});

test('admin can update a program', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $program = Program::factory()->create(['code' => 'PRG-2026-001']);

    $response = $this->put(route('programs-management.update', $program), [
        'code' => 'PRG-2026-002',
        'name' => 'Program Diperbarui',
        'year' => 2027,
        'id_fund' => null,
    ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    expect($program->fresh()->code)->toBe('PRG-2026-002')
        ->and($program->fresh()->name)->toBe('Program Diperbarui')
        ->and($program->fresh()->year)->toBe(2027)
        ->and($program->fresh()->id_fund)->toBeNull();
});

test('admin can delete a program', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $program = Program::factory()->create();

    $response = $this->delete(route('programs-management.destroy', $program));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($program);
});

test('deleting a program keeps its principals by nulling the relation', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $program = Program::factory()->create();
    $principal = Principal::factory()->for($program)->create();

    $this->delete(route('programs-management.destroy', $program))->assertRedirect();

    expect($principal->fresh())->not->toBeNull()
        ->and($principal->fresh()->program_id)->toBeNull();
});
