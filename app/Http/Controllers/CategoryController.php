<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::simplePaginate(15);

        return Inertia::render('categories/index-category', [
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

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.Str::random(5),
            'description' => $request->description ?? null
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
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

        $category = Category::findOrFail($id);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name).'-'.Str::random(5),
            'description' => $request->description ?? null
        ]);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
