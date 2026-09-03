<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BlacklistMerchantController;
use App\Http\Controllers\BlacklistMerchantManagementController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EditorController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\NewsManagementController;
use App\Http\Controllers\PrincipalController;
use App\Http\Controllers\PrincipalDocumentManagementController;
use App\Http\Controllers\PrincipalManagementController;
use App\Http\Controllers\PrincipalReferenceDocumentController;
use App\Http\Controllers\PrincipalReferenceDocumentManagementController;
use App\Http\Controllers\ResellerController;
use App\Http\Controllers\ResellerManagementController;
use App\Http\Controllers\TemplateDocumentManagementController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('news.index');
    Route::get('/{news:slug}', [NewsController::class, 'show'])->name('news.show');
});

Route::prefix('blacklist')->group(function () {
    Route::get('/', [BlacklistMerchantController::class, 'index'])->name('blacklist.index');
    Route::get('/{id}', [BlacklistMerchantController::class, 'show'])->name('blacklist.show');
});

Route::prefix('principals')->group(function () {
    Route::get('/', [PrincipalController::class, 'index'])->name('principals.index');
    Route::get('/{principal}', [PrincipalController::class, 'show'])->name('principals.show');
});

Route::prefix('reseller')->group(function () {
    Route::get('/{referenceCode}', [ResellerController::class, 'show'])->name('resellers.show');
});

Route::prefix('reference-documents')->group(function () {
    Route::get('/', [PrincipalReferenceDocumentController::class, 'index'])->name('reference-documents.index');
    Route::get('/{referenceId}', [PrincipalReferenceDocumentController::class, 'show'])->name('reference-documents.show');
    Route::get('/{referenceId}/verify', [PrincipalReferenceDocumentController::class, 'verify'])->name('reference-documents.verify');
});

Route::get('/template-documents/{id}/download', function (string $id) {
    $jsonPath = storage_path('app/template-documents.json');

    if (! file_exists($jsonPath)) {
        abort(404);
    }

    $documents = json_decode(file_get_contents($jsonPath), true) ?? [];
    $document = collect($documents)->firstWhere('id', $id);

    if (! $document) {
        abort(404);
    }

    $filePath = storage_path('app/public/'.$document['file_path']);

    if (! file_exists($filePath)) {
        abort(404);
    }

    return response()->download($filePath, $document['file_name']);
})->name('template-documents.download');

Route::get('/about', function () {
    return Inertia::render('about-us');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('contact-us');
})->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, '__invoke'])->name('dashboard');

    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');

    Route::prefix('news-management')->group(function () {
        Route::get('/', [NewsManagementController::class, 'index'])->name('news-management.index');
        Route::get('/{id}/show', [NewsManagementController::class, 'show'])->name('news-management.show');
        Route::get('/create', [NewsManagementController::class, 'create'])->name('news-management.create');
        Route::post('/', [NewsManagementController::class, 'store'])->name('news-management.store');
        Route::get('/{id}/edit', [NewsManagementController::class, 'edit'])->name('news-management.edit');
        Route::put('/{id}', [NewsManagementController::class, 'update'])->name('news-management.update');
        Route::delete('/{id}/delete', [NewsManagementController::class, 'destroy'])->name('news-management.destroy');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/{id}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/{id}/delete', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    Route::prefix('blacklist-merchants')->group(function () {
        Route::get('/', [BlacklistMerchantManagementController::class, 'index'])->name('blacklist-merchants.index');
        Route::post('/', [BlacklistMerchantManagementController::class, 'store'])->name('blacklist-merchants.store');
        Route::put('/{id}', [BlacklistMerchantManagementController::class, 'update'])->name('blacklist-merchants.update');
        Route::delete('/{id}/delete', [BlacklistMerchantManagementController::class, 'destroy'])->name('blacklist-merchants.destroy');
    });

    Route::prefix('principal-management')->group(function () {
        Route::get('/', [PrincipalManagementController::class, 'index'])->name('principal-management.index');
        Route::post('/', [PrincipalManagementController::class, 'store'])->name('principal-management.store');
        Route::get('/{principal}', [PrincipalManagementController::class, 'show'])->name('principal-management.show');
        Route::put('/{principal}', [PrincipalManagementController::class, 'update'])->name('principal-management.update');
        Route::delete('/{principal}/delete', [PrincipalManagementController::class, 'destroy'])->name('principal-management.destroy');
        Route::post('/{principal}/resellers', [ResellerManagementController::class, 'store'])->name('principal-management.resellers.store');
        Route::get('/{principal}/resellers/import', [ResellerManagementController::class, 'import'])->name('principal-management.resellers.import');
        Route::post('/{principal}/resellers/import', [ResellerManagementController::class, 'importStore'])->name('principal-management.resellers.import.store');
        Route::get('/{principal}/resellers/import/{import}/status', [ResellerManagementController::class, 'importStatus'])->name('principal-management.resellers.import.status');
        Route::get('/{principal}/resellers/import/template', [ResellerManagementController::class, 'importTemplate'])->name('principal-management.resellers.import.template');
        Route::put('/{principal}/resellers/{reseller}', [ResellerManagementController::class, 'update'])->name('principal-management.resellers.update');
        Route::delete('/{principal}/resellers/{reseller}/delete', [ResellerManagementController::class, 'destroy'])->name('principal-management.resellers.destroy');
        Route::post('/{principal}/documents', [PrincipalDocumentManagementController::class, 'store'])->name('principal-management.documents.store');
        Route::put('/{principal}/documents/{document}', [PrincipalDocumentManagementController::class, 'update'])->name('principal-management.documents.update');
        Route::delete('/{principal}/documents/{document}/delete', [PrincipalDocumentManagementController::class, 'destroy'])->name('principal-management.documents.destroy');
    });

    Route::prefix('reference-documents-management')->group(function () {
        Route::get('/', [PrincipalReferenceDocumentManagementController::class, 'index'])->name('reference-documents-management.index');
        Route::post('/', [PrincipalReferenceDocumentManagementController::class, 'store'])->name('reference-documents-management.store');
        Route::put('/{id}', [PrincipalReferenceDocumentManagementController::class, 'update'])->name('reference-documents-management.update');
        Route::delete('/{id}/delete', [PrincipalReferenceDocumentManagementController::class, 'destroy'])->name('reference-documents-management.destroy');
    });

    Route::prefix('editors')->group(function () {
        Route::post('/upload-images', [EditorController::class, 'uploadImages'])->name('news-management.upload-images');
    });

    Route::prefix('template-documents-management')->group(function () {
        Route::get('/', [TemplateDocumentManagementController::class, 'index'])->name('template-documents-management.index');
        Route::post('/', [TemplateDocumentManagementController::class, 'store'])->name('template-documents-management.store');
        Route::put('/{id}', [TemplateDocumentManagementController::class, 'update'])->name('template-documents-management.update');
        Route::delete('/{id}/delete', [TemplateDocumentManagementController::class, 'destroy'])->name('template-documents-management.destroy');
    });

    Route::prefix('user-management')->middleware('admin')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('user-management.index');
        Route::post('/', [UserManagementController::class, 'store'])->name('user-management.store');
        Route::put('/{id}', [UserManagementController::class, 'update'])->name('user-management.update');
        Route::delete('/{id}/delete', [UserManagementController::class, 'destroy'])->name('user-management.destroy');
    });
});

require __DIR__.'/settings.php';
