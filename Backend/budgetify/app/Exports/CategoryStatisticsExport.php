<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CategoryStatisticsExport implements FromCollection, WithHeadings
{
    protected $statistics;

    public function __construct($statistics)
    {
        $this->statistics = $statistics;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $data = [];

        foreach ($this->statistics as $category => $amount) {
            if ($category !== 'currency') {
                $data[] = [
                    'Category' => $category,
                    'Amount' => $amount,
                    'Currency' => $this->statistics['currency'],
                ];
            }
        }

        return collect($data);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'Category',
            'Amount',
            'Currency',
        ];
    }
}
