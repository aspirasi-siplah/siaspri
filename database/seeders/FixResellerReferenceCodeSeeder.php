<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FixResellerReferenceCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resellers = \App\Models\Reseller::query()
            ->whereRaw("reference_code ~ '[^a-zA-Z0-9-]'")
            ->get();

        foreach ($resellers as $reseller) {
            $reseller->reference_code = \App\Models\Reseller::generateReferenceCode($reseller->name);
            $reseller->save();
        }
    }
}
