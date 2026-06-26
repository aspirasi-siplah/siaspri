<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlacklistMerchantRequest;
use App\Http\Requests\UpdateBlacklistMerchantRequest;
use App\Models\BlacklistMerchant;
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
                    'reason' => $merchant->reason,
                    'created_at' => $merchant->created_at->translatedFormat('d M Y H:i'),
                ];
            });

        return Inertia::render(
            'blacklist-merchants/index-blacklist-merchant',
            [
                'merchants' => $merchants,
            ]
        );
    }

    public function store(StoreBlacklistMerchantRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $merchant = BlacklistMerchant::create([
                'merchant_name' => $validated['merchant_name'],
                'reason' => $validated['reason'],
            ]);

            if ($request->hasFile('image')) {
                $merchant->update([
                    'image' => $request->file('image')->store('blacklist-merchants', 'public'),
                ]);
            }
        });

        return redirect()->back()->with(
            'success',
            'Merchant berhasil ditambahkan.'
        );
    }

    public function update(UpdateBlacklistMerchantRequest $request, $id)
    {
        $validated = $request->validated();

        $blacklistMerchant = BlacklistMerchant::findOrFail($id);

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

        return redirect()->back()->with(
            'success',
            'Merchant berhasil diperbarui.'
        );
    }

    public function destroy($id)
    {
        $blacklistMerchant = BlacklistMerchant::findOrFail($id);

        DB::transaction(function () use ($blacklistMerchant) {

            if ($blacklistMerchant->image) {
                Storage::disk('public')->delete($blacklistMerchant->image);
            }

            $blacklistMerchant->delete();

        });

        return redirect()->back()->with(
            'success',
            'Merchant berhasil dihapus.'
        );
    }
}
