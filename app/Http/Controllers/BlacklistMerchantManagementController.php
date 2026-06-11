<?php

namespace App\Http\Controllers;

use App\Models\BlacklistMerchant;
use Illuminate\Http\Request;
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

                    'image' => $merchant->image
                        ? Storage::url($merchant->image)
                        : null,

                    'reason' => Str::limit(
                        strip_tags($merchant->reason),
                        100
                    ),

                    'created_at' => $merchant->created_at
                        ->translatedFormat('d M Y H:i'),
                ];
            });

        return Inertia::render(
            'blacklist-merchant/index',
            [
                'merchants' => $merchants,
            ]
        );
    }
}
