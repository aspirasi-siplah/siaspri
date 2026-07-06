<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EditorController extends Controller
{
    public function uploadImages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|max:2048',
        ], [
            'image.required' => 'Gambar harus diunggah.',
            'image.image' => 'File yang diunggah harus berupa gambar.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $path = $request
            ->file('image')
            ->store('news/content');

        return response()->json([
            'url' => Storage::url($path),
        ]);
    }
}
