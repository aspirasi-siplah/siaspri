<?php

use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\AccountCreated;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('user-management.index'))
        ->assertRedirect(route('login'));
});

test('admin can visit the user management index', function () {
    $admin = User::factory()->asAdmin()->create();
    User::factory()->asUser()->create();

    $this->actingAs($admin)
        ->get(route('user-management.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user-management/index-user-management')
            ->has('users.data', 2)
            ->has('role_options', 2));
});

test('a regular user cannot visit the user management index', function () {
    $user = User::factory()->asUser()->create();

    $this->actingAs($user)
        ->get(route('user-management.index'))
        ->assertForbidden();
});

test('a regular user cannot store a new user', function () {
    $user = User::factory()->asUser()->create();

    $this->actingAs($user)
        ->post(route('user-management.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => UserRole::USER->value,
        ])
        ->assertForbidden();
});

test('admin can store a new user and sends an email with a set password link', function () {
    Notification::fake();

    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('user-management.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => UserRole::USER->value,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'role' => UserRole::USER->value,
    ]);

    $user = User::where('email', 'john@example.com')->first();

    Notification::assertSentTo($user, AccountCreated::class, function ($notification) use ($user) {
        $this->assertStringContainsString(
            '/reset-password/',
            $notification->resetUrl
        );
        $this->assertStringContainsString(
            '?email='.urlencode($user->email),
            $notification->resetUrl
        );

        return true;
    });
});

test('admin can update a user without changing the password', function () {
    $admin = User::factory()->asAdmin()->create();
    $target = User::factory()->asUser()->create();

    $response = $this->actingAs($admin)
        ->put(route('user-management.update', $target->id), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'role' => UserRole::ADMIN->value,
            'password' => '',
            'password_confirmation' => '',
        ]);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $target->refresh();

    expect($target->name)->toBe('Jane Doe')
        ->and($target->email)->toBe('jane@example.com')
        ->and($target->role)->toBe(UserRole::ADMIN);
});

test('admin can update a user password', function () {
    $admin = User::factory()->asAdmin()->create();
    $target = User::factory()->asUser()->create();

    $this->actingAs($admin)
        ->put(route('user-management.update', $target->id), [
            'name' => $target->name,
            'email' => $target->email,
            'role' => UserRole::USER->value,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Hash::check('newpassword123', $target->fresh()->password))->toBeTrue();
});

test('a regular user cannot update another user', function () {
    $user = User::factory()->asUser()->create();
    $target = User::factory()->asUser()->create();

    $this->actingAs($user)
        ->put(route('user-management.update', $target->id), [
            'name' => 'Hacked',
            'email' => $target->email,
            'role' => UserRole::USER->value,
        ])
        ->assertForbidden();
});

test('admin can delete another user', function () {
    $admin = User::factory()->asAdmin()->create();
    $target = User::factory()->asUser()->create();

    $this->actingAs($admin)
        ->delete(route('user-management.destroy', $target->id))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($target);
});

test('admin cannot delete their own account', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->delete(route('user-management.destroy', $admin->id))
        ->assertRedirect()
        ->assertSessionHas('error');

    $this->assertModelExists($admin);
});
