<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::simplePaginate(15);

        return Inertia::render('categories/IndexCategory', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ], [
            'name.required' => 'Nama kategori harus diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori maksimal berukuran 255 karakter.',
            'name.unique' => 'Nama kategori sudah ada.',
            'description.string' => 'Deskripsi harus berupa teks.',
        ]);

        dd($request->all());

        try {
            Category::create([
                'name' => $request->name,
                'slug' => Category::generateUniqueSlug($request->name),
                'description' => $request->description ?? null
            ]);
    
            return redirect()->route('categories.index');
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ], [
            'name.required' => 'Nama kategori harus diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori maksimal berukuran 255 karakter.',
            'name.unique' => 'Nama kategori sudah ada.',
            'description.string' => 'Deskripsi harus berupa teks.',
        ]);

        try {
            $category = Category::findOrFail($id);
            $category->update([
                'name' => $request->name,
                'slug' => Category::generateUniqueSlug($request->name),
                'description' => $request->description ?? null
            ]);
    
            return redirect()->route('categories.index');
        } catch (\Exception $e) {
            return redirect()->route('categories.index')->with('error', $e->getMessage());
        }
    }
}
