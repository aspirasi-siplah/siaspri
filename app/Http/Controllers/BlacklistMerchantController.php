<?php

namespace App\Http\Controllers;

use App\Models\BlacklistMerchant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlacklistMerchantController extends Controller
{
    public function index(Request $request)
    {    
        $merchants = BlacklistMerchant::query()
            ->latest()
            ->when($request->search, function ($query, $search) {
                $query->where('merchant_name', 'ILIKE', '%' . $search . '%');
            })
            ->paginate(12)
            ->through(fn($merchant) => [
                'id' => $merchant->id,
                'merchant_name' => $merchant->merchant_name,
                'image' => $merchant->image,
                'reason' => Str::limit(
                    strip_tags($merchant->reason),
                    140
                ),
                'created_at' => $merchant
                    ->created_at
                    ->translatedFormat(
                        'd F Y'
                    ),
            ]);

        return Inertia::render(
            'blacklist/index',
            [
                'merchants' => $merchants,
            ]
        );
    }

    public function show($id) {
        $blacklistMerchant = BlacklistMerchant::findOrFail($id);

        return Inertia::render('blacklist/show',
            [
                'merchant' => [
                    'id' => $blacklistMerchant->id,
                    'merchant_name' => $blacklistMerchant->merchant_name,
                    'image' => $blacklistMerchant->image,
                    'reason' => $blacklistMerchant->reason,

                    'created_at' => $blacklistMerchant
                        ->created_at
                        ->translatedFormat('d F Y'),
                ],
            ]
        );
    }
}
