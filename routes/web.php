<?php

use App\Http\Controllers\BlacklistMerchantController;
use App\Http\Controllers\BlacklistMerchantManagementController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('news.index');
    Route::get('/{news:slug}', [NewsController::class, 'show'])->name('news.show');
});

Route::prefix('blacklist')->group(function () {
    Route::get('/', [BlacklistMerchantController::class, 'index'])->name('blacklist.index');
    Route::get('/{id}', [BlacklistMerchantController::class, 'show'])->name('blacklist.show');
});

Route::get('/about', function () {
    return Inertia::render('AboutUs');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('ContactUs');
})->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('news-management')->group(function () {
        Route::get('/', [NewsManagementController::class, 'index'])->name('news-management.index');
        Route::get('/{id}/show', [NewsManagementController::class, 'show'])->name('news-management.show');
        Route::get('/create', [NewsManagementController::class, 'create'])->name('news-management.create');
        Route::post('/', [NewsManagementController::class, 'store'])->name('news-management.store');
        Route::get('/{id}/edit', [NewsManagementController::class, 'edit'])->name('news-management.edit');
        Route::put('/{id}', [NewsManagementController::class, 'update'])->name('news-management.update');
        Route::delete('/{id}/delete', [NewsManagementController::class, 'destroy'])->name('news-management.destroy');
    });

    Route::prefix('blacklist-merchants')->group(function () {
        Route::get('/', [BlacklistMerchantManagementController::class, 'index'])->name('blacklist-merchants.index');
        Route::post('/', [BlacklistMerchantManagementController::class, 'store'])->name('blacklist-merchants.store');
        Route::put('/{id}', [BlacklistMerchantManagementController::class, 'update'])->name('blacklist-merchants.update');
        Route::delete('/{id}/delete', [BlacklistMerchantManagementController::class, 'destroy'])->name('blacklist-merchants.destroy');
    });
});


require __DIR__.'/settings.php';
