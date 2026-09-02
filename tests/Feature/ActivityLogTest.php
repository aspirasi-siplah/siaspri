<?php

use App\Enums\UserRole;
use App\Models\Activity;
use App\Models\Category;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('activity-log.index'))
        ->assertRedirect(route('login'));
});

test('a regular user can visit the activity log index', function () {
    $user = User::factory()->asUser()->create();

    $this->actingAs($user)
        ->get(route('activity-log.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('log-activity/index-log-activity'));
});

test('a regular user does not see the user module activities', function () {
    $admin = User::factory()->asAdmin()->create();
    User::factory()->asUser()->create();

    $this->actingAs($admin)->post(route('categories.store'), [
        'name' => 'Berita Terkini',
        'slug' => 'berita-terkini',
        'description' => 'Kategori berita terkini',
    ]);

    $regularUser = User::factory()->asUser()->create();

    $this->actingAs($regularUser)
        ->get(route('activity-log.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('log-activity/index-log-activity')
            ->has('activities.data', 1)
            ->where('activities.data.0.module', 'Kategori Berita'));
});

test('creating a model logs an activity', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('categories.store'), [
            'name' => 'Berita Terkini',
            'slug' => 'berita-terkini',
            'description' => 'Kategori berita terkini',
        ])
        ->assertRedirect();

    $activity = Activity::where('subject_type', Category::class)->first();

    expect($activity)->not->toBeNull()
        ->and($activity->description)->toBe('membuat')
        ->and($activity->event)->toBe('created')
        ->and($activity->causer_id)->toBe($admin->id)
        ->and($activity->attribute_changes['attributes']['name'])->toBe('Berita Terkini');
});

test('admin can visit the activity log index and sees logged activities', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->post(route('categories.store'), [
        'name' => 'Berita Terkini',
        'slug' => 'berita-terkini',
        'description' => 'Kategori berita terkini',
    ]);

    $this->actingAs($admin)
        ->get(route('activity-log.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('log-activity/index-log-activity')
            ->has('activities.data', 2)
            ->where('activities.data.0.causer_name', $admin->name)
            ->where('activities.data.0.changes.attributes.name', 'Berita Terkini'));
});

test('logging in does not create an updated activity when only remember_token changes', function () {
    $user = User::factory()->asUser()->create();

    $countBefore = Activity::count();

    $user->setRememberToken('login-token');
    $user->save();

    expect(Activity::count())->toBe($countBefore)
        ->and(Activity::where('subject_type', User::class)
            ->where('subject_id', $user->id)
            ->where('event', 'updated')
            ->exists())->toBeFalse();
});

test('updating a user logs an activity with role changes', function () {
    $admin = User::factory()->asAdmin()->create();
    $target = User::factory()->asUser()->create();

    $this->actingAs($admin)
        ->put(route('user-management.update', $target->id), [
            'name' => 'Jane Doe',
            'email' => $target->email,
            'role' => UserRole::ADMIN->value,
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect();

    $activity = Activity::where('subject_type', User::class)
        ->where('subject_id', $target->id)
        ->latest('id')
        ->first();

    expect($activity)->not->toBeNull()
        ->and($activity->event)->toBe('updated')
        ->and($activity->attribute_changes['attributes']['name'])->toBe('Jane Doe')
        ->and($activity->attribute_changes['old']['name'])->toBe($target->name);
});
