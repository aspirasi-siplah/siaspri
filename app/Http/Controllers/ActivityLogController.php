<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    private const MODULES = [
        'user' => 'Pengguna',
        'category' => 'Kategori Berita',
        'news' => 'Berita',
        'news_documents' => 'Dokumen Berita',
        'blacklist_merchant' => 'Blacklist Merchant',
        'principal' => 'Principal',
        'principal_document' => 'Dokumen Principal',
        'principal_reference_document' => 'Dokumen Referensi',
        'reseller' => 'Reseller',
    ];

    public function index(): Response
    {
        $activities = Activity::query()
            ->with('causer')
            ->when(! auth()->user()?->isAdmin(), fn ($query) => $query
                ->where('subject_type', '!=', User::class)
            )
            ->latest('id')
            ->paginate(15)
            ->through(function (Activity $activity) {
                $causer = $activity->causer;
                $module = $activity->subject_type
                    ? Str::snake(class_basename($activity->subject_type))
                    : null;

                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'event' => $activity->event,
                    'module' => $module ? self::MODULES[$module] ?? $activity->subject_type : 'Sistem',
                    'causer_name' => $causer?->name ?? 'Sistem',
                    'causer_email' => $causer?->email ?? '-',
                    'changes' => $activity->attribute_changes?->toArray() ?? [],
                    'created_at' => $activity->created_at?->translatedFormat('d M Y H:i:s'),
                ];
            });

        return Inertia::render('log-activity/index-log-activity', [
            'activities' => $activities,
        ]);
    }
}
