<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EditorController extends Controller
{
    public function uploadImages(Request $request) {
        $request->validate([
            'image' => 'required|image|max:4096',
        ]);

        $path = $request
            ->file('image')
            ->store(
                'news/content',
                'public'
            );

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
