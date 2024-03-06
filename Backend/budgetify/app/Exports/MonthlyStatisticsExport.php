<?php

namespace App\Exports;

use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MonthlyStatisticsExport implements FromCollection, WithHeadings
{
    /**
     * @var array
     */
    protected $statistics;

    /**
     * MonthlyStatisticsExport constructor.
     *
     * @param array $statistics
     */
    public function __construct(array $statistics)
    {
        $this->statistics = $statistics;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $data = [];

        foreach ($this->statistics as $month => $stats) {
            Log::info($stats);
            $data[] = [
                'Month' => $stats['month'],
                'Income' => $stats['income'],
                'Expenses' => $stats['expenses'],
                'Economy' => $stats['economy'],
                'Percentage of Economy' => $stats['percentage_of_economy'],
            ];
        }

        return collect($data);
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return ['Month', 'Income', 'Expenses', 'Economy', 'Percentage of Economy'];
    }
}
