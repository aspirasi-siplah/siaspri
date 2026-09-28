<?php

use App\Jobs\ExportResellers;
use App\Models\Principal;
use App\Models\Reseller;
use App\Models\ResellerExport;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use PhpOffice\PhpSpreadsheet\IOFactory;

test('index page exposes the latest export of the signed in user', function () {
    $user = User::factory()->create();
    Principal::factory()->create();
    $export = ResellerExport::factory()->completed()->create(['user_id' => $user->id]);
    $otherExport = ResellerExport::factory()->completed()->create(['user_id' => User::factory()->create()->id]);

    $this->actingAs($user)
        ->get(route('principal-management.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('principal-management/index')
            ->where('activeExport.id', $export->id)
            ->where('activeExport.status', 'completed')
            ->where('activeExport.download_url', route('resellers-export.download', $export))
            ->where('activeExport.id', fn ($value) => $value !== $otherExport->id));
});

test('export request is queued', function () {
    Queue::fake();

    $user = User::factory()->create();
    Principal::factory()->create();

    $this->actingAs($user)
        ->from(route('principal-management.index'))
        ->post(route('resellers-export.store'))
        ->assertRedirect(route('principal-management.index'))
        ->assertSessionHas('success');

    $export = ResellerExport::query()->where('user_id', $user->id)->first();

    expect($export)->not->toBeNull()
        ->and($export->status)->toBe('processing')
        ->and($export->total)->toBe(0);

    Queue::assertPushed(ExportResellers::class, fn (ExportResellers $job) => $job->export->is($export));
});

test('guest cannot request an export', function () {
    $this->post(route('resellers-export.store'))->assertRedirect(route('login'));
});

test('queued export generates a spreadsheet file with principal and reseller names', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $principalA = Principal::factory()->create(['name' => 'Principal A']);
    $principalB = Principal::factory()->create(['name' => 'Principal B']);
    Reseller::factory()->create(['principal_id' => $principalA->id, 'name' => 'Reseller A']);
    Reseller::factory()->create(['principal_id' => $principalA->id, 'name' => 'Reseller B']);
    Reseller::factory()->create(['principal_id' => $principalB->id, 'name' => 'Reseller C']);

    $this->actingAs($user)
        ->from(route('principal-management.index'))
        ->post(route('resellers-export.store'))
        ->assertRedirect();

    $export = ResellerExport::query()->where('user_id', $user->id)->firstOrFail();

    expect($export->status)->toBe('completed')
        ->and($export->total)->toBe(3)
        ->and($export->file_name)->toEndWith('.xlsx');

    Storage::disk('local')->assertExists($export->file_path);

    $spreadsheet = IOFactory::load(Storage::disk('local')->path($export->file_path));
    $rows = $spreadsheet->getActiveSheet()->rangeToArray('A1:B4');

    expect($rows[0])->toBe(['Nama Principal', 'Nama Reseller'])
        ->and($rows[1])->toBe(['Principal A', 'Reseller A'])
        ->and($rows[2])->toBe(['Principal A', 'Reseller B'])
        ->and($rows[3])->toBe(['Principal B', 'Reseller C']);

    $sheet = $spreadsheet->getActiveSheet();

    dump([
        'a' => $sheet->getColumnDimension('A')->getWidth(),
        'b' => $sheet->getColumnDimension('B')->getWidth(),
        'c' => $sheet->getColumnDimension('C')->getWidth(),
    ]);

    expect($sheet->getStyle('A1')->getFont()->getBold())->toBeTrue()
        ->and($sheet->getStyle('A1')->getFill()->getFillType())->toBe('solid')
        ->and($sheet->getColumnDimension('A')->getCustomWidth())->toBeTrue()
        ->and($sheet->getColumnDimension('B')->getCustomWidth())->toBeTrue();
});

test('resellers of a soft deleted principal are not exported', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $principal = Principal::factory()->create(['name' => 'Principal Aktif']);
    $deletedPrincipal = Principal::factory()->create(['name' => 'Principal Dihapus']);
    Reseller::factory()->create(['principal_id' => $principal->id, 'name' => 'Reseller Aktif']);
    Reseller::factory()->create(['principal_id' => $deletedPrincipal->id, 'name' => 'Reseller Dihapus']);
    $deletedPrincipal->delete();

    $this->actingAs($user)
        ->from(route('principal-management.index'))
        ->post(route('resellers-export.store'));

    $export = ResellerExport::query()->where('user_id', $user->id)->firstOrFail();

    expect($export->status)->toBe('completed')->and($export->total)->toBe(1);

    $spreadsheet = IOFactory::load(Storage::disk('local')->path($export->file_path));

    expect($spreadsheet->getActiveSheet()->rangeToArray('A1:B4'))->toBe([
        ['Nama Principal', 'Nama Reseller'],
        ['Principal Aktif', 'Reseller Aktif'],
        [null, null],
        [null, null],
    ]);
});

test('a new export removes the previously generated file', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $principal = Principal::factory()->create();
    Reseller::factory()->create(['principal_id' => $principal->id]);

    $this->actingAs($user)->from(route('principal-management.index'))->post(route('resellers-export.store'));
    $previousExport = ResellerExport::query()->where('user_id', $user->id)->firstOrFail();
    Storage::disk('local')->assertExists($previousExport->file_path);

    $this->actingAs($user)->from(route('principal-management.index'))->post(route('resellers-export.store'));
    $latestExport = ResellerExport::query()->where('user_id', $user->id)->latest('id')->firstOrFail();

    expect($latestExport->status)->toBe('completed')
        ->and($previousExport->fresh()->file_path)->toBeNull()
        ->and($previousExport->fresh()->status)->toBe('completed');

    Storage::disk('local')->assertMissing($previousExport->fresh()->file_path);
    Storage::disk('local')->assertExists($latestExport->file_path);
});

test('failed export is marked as failed', function () {
    Storage::fake('local');

    $export = ResellerExport::factory()->create();

    (new ExportResellers($export))->failed(new RuntimeException('Gagal'));

    expect($export->fresh()->status)->toBe('failed');
});

test('user can download their own export', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $export = ResellerExport::factory()->completed()->create([
        'user_id' => $user->id,
        'file_path' => 'reseller-exports/resellers.xlsx',
        'file_name' => 'resellers-20260901-101010.xlsx',
    ]);
    Storage::disk('local')->put('reseller-exports/resellers.xlsx', 'xlsx-content');

    $this->actingAs($user)
        ->get(route('resellers-export.download', $export))
        ->assertSuccessful()
        ->assertDownload('resellers-20260901-101010.xlsx');
});

test('export of another user cannot be downloaded or checked', function () {
    $user = User::factory()->create();
    $export = ResellerExport::factory()->completed()->create();

    $this->actingAs($user)
        ->get(route('resellers-export.download', $export))
        ->assertNotFound();

    $this->actingAs($user)
        ->getJson(route('resellers-export.status', $export))
        ->assertNotFound();
});

test('export that is still processing cannot be downloaded', function () {
    $user = User::factory()->create();
    $export = ResellerExport::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('resellers-export.download', $export))
        ->assertNotFound();
});

test('user can fetch the export status endpoint', function () {
    $user = User::factory()->create();
    $export = ResellerExport::factory()->create(['user_id' => $user->id, 'total' => 0]);

    $this->actingAs($user)
        ->getJson(route('resellers-export.status', $export))
        ->assertOk()
        ->assertExactJson([
            'id' => $export->id,
            'status' => 'processing',
            'total' => 0,
            'download_url' => null,
        ]);
});
