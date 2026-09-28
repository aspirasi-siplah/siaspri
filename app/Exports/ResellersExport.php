<?php

namespace App\Exports;

use App\Models\Reseller;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ResellersExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    public int $chunkSize = 500;

    /**
     * @return Builder<Reseller>
     */
    public function query(): Builder
    {
        return Reseller::query()
            ->whereHas('principal')
            ->with('principal:id,name')
            ->select(['id', 'principal_id', 'name'])
            ->orderBy('principal_id')
            ->orderBy('name')
            ->orderBy('id');
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return ['Nama Principal', 'Nama Reseller'];
    }

    /**
     * @param  Reseller  $reseller
     * @return array<int, string>
     */
    public function map($reseller): array
    {
        return [
            (string) $reseller->principal?->name,
            (string) $reseller->name,
        ];
    }

    /**
     * @return array<int|string, array<string, mixed>>
     */
    public function styles(Worksheet $sheet): array
    {
        $styles = [1 => $this->headerStyle()];

        $highestDataRow = $sheet->getHighestDataRow();

        if ($highestDataRow > 1) {
            $styles['A2:'.$sheet->getHighestColumn().$highestDataRow] = $this->bodyStyle();
        }

        return $styles;
    }

    /**
     * @return array<string, mixed>
     */
    private function headerStyle(): array
    {
        return [
            'font' => [
                'bold' => true,
                'size' => 11,
                'color' => ['argb' => 'FFFFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1D4ED8'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => $this->borderStyle(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function bodyStyle(): array
    {
        return [
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => $this->borderStyle(),
        ];
    }

    /**
     * @return array{allBorders: array{borderStyle: string, color: array{argb: string}}}
     */
    private function borderStyle(): array
    {
        return [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => [
                    'argb' => '767676',
                ],
            ],
        ];
    }
}
