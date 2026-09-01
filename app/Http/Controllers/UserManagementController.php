<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Notifications\AccountCreated;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->latest('id')
            ->paginate(10)
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->value ?? 'admin',
                    'created_at' => $user->created_at?->translatedFormat('d M Y'),
                ];
            });

        return Inertia::render('user-management/index-user-management', [
            'users' => $users,
            'role_options' => collect(UserRole::cases())->map(
                fn (UserRole $role) => $role->toArray()
            )->values()->all(),
            'current_user_role' => auth()->user()?->role,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            ...$request->validated(),
            'password' => Str::random(40),
        ]);

        $token = Password::broker()->createToken($user);

        $user->notify(new AccountCreated(
            route('password.reset', $token).'?email='.urlencode($user->email)
        ));

        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        $user->update($validated);

        return redirect()->back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
