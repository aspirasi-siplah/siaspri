<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('news.index');
    Route::get('/{news:slug}', [NewsController::class, 'show'])->name('news.show');
});

Route::get('/about', function () {
    return Inertia::render('AboutUs');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('ContactUs');
})->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('news-management')->name('news-management.')->group(function () {
        Route::get('/', [\App\Http\Controllers\NewsManagementController::class, 'index'])->name('news-management.index');
        Route::get('/create', [\App\Http\Controllers\NewsManagementController::class, 'create'])->name('news-management.create');
        Route::post('/', [\App\Http\Controllers\NewsManagementController::class, 'store'])->name('news-management.store');
        Route::get('/{news:slug}/edit', [\App\Http\Controllers\NewsManagementController::class, 'edit'])->name('news-management.edit');
        Route::put('/{news:slug}', [\App\Http\Controllers\NewsManagementController::class, 'update'])->name('news-management.update');
        Route::delete('/{news:slug}', [\App\Http\Controllers\NewsManagementController::class, 'destroy'])->name('news-management.destroy');
    });
});


require __DIR__.'/settings.php';
