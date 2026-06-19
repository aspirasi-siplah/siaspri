<?php

namespace App\Http\Controllers;

use App\Models\BlacklistMerchant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlacklistMerchantManagementController extends Controller
{
    public function index()
    {
        $merchants = BlacklistMerchant::query()
            ->latest()
            ->paginate(10)
            ->through(function (BlacklistMerchant $merchant) {
                return [
                    'id' => $merchant->id,
                    'merchant_name' => $merchant->merchant_name,
                    'image' => $merchant->image,
                    'reason' => Str::limit(strip_tags($merchant->reason), 100),
                    'created_at' => $merchant->created_at->translatedFormat('d M Y H:i'),
                ];
            });

        return Inertia::render(
            'blacklist-merchants/IndexBlacklistMerchant',
            [
                'merchants' => $merchants,
            ]
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'merchant_name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'reason' => ['required', 'string'],
        ], [
            'merchant_name.required' => 'Nama merchant wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'reason.required' => 'Alasan blacklist wajib diisi.',
        ]);

        DB::transaction(function () use ($request, $validated) {
            $merchant = BlacklistMerchant::create([
                'merchant_name' => $validated['merchant_name'],
                'reason' => $validated['reason'],
            ]);
            
            if ($request->hasFile('image')) {
                $merchant->update([
                    'image' => $request->file('image')->store('blacklist-merchants', 'public')
                ]);
            }
        });

        return redirect()->route('blacklist-merchants.index')->with(
                'success',
                'Merchant berhasil ditambahkan.'
            );
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'merchant_name' => ['required', 'string', 'max:255',],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'reason' => ['required', 'string'],
        ], [
            'merchant_name.required' => 'Nama merchant wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
            'reason.required' => 'Alasan blacklist wajib diisi.',
        ]);

        $blacklistMerchant = BlacklistMerchant::findOrFail($id);

        if (!$blacklistMerchant) {
            return redirect()->route('blacklist-merchants.index')->with(
                'error',
                'Merchant tidak ditemukan.'
            );
        }

        DB::transaction(function () use ($request, $validated, $blacklistMerchant) {
            $blacklistMerchant->update([
                'merchant_name' => $validated['merchant_name'],
                'reason' => $validated['reason'],
            ]);
            
            if ($request->hasFile('image')) {
                if ($blacklistMerchant->image) {
                    Storage::disk('public')->delete($blacklistMerchant->image);
                }
                $image = $request->file('image')->store('blacklist-merchants', 'public');

                $blacklistMerchant->update([
                    'image' => $image,
                ]);
            }
        });

        return redirect()->route('blacklist-merchants.index')->with(
            'success',
            'Merchant berhasil diperbarui.'
        );
    }

    public function destroy(BlacklistMerchant $blacklistMerchant) {
        DB::transaction(function () use ($blacklistMerchant) {
            if ($blacklistMerchant->image) {
                Storage::disk('public')->delete($blacklistMerchant->image);
            }
            $blacklistMerchant->delete();
        });

        return redirect()->route('blacklist-merchants.index')->with(
            'success',
            'Merchant berhasil dihapus.'
        );
    }
}
