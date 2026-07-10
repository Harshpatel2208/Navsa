<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportShippingPorts extends Command
{
    protected $signature = 'shipping:import-ports {file}';
    protected $description = 'Import shipping countries and ports from Excel';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: {$filePath}");
            return 1;
        }

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        array_shift($rows);

        DB::table('shipping_ports')->delete();
        DB::table('shipping_countries')->delete();

        foreach ($rows as $row) {
            $countryName = trim((string) ($row[0] ?? ''));

            if ($countryName === '') {
                continue;
            }

            $zoneId = strtolower($countryName) === 'united kingdom' ? 1 : 2;

            $countryId = DB::table('shipping_countries')->insertGetId([
                'zone_id' => $zoneId,
                'country_name' => $countryName,
                // 'country_code' => strtoupper(substr($countryName, 0, 2)),
                'country_code' => 'XX',
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            for ($i = 1; $i <= 10; $i++) {
                $portName = trim((string) ($row[$i] ?? ''));

                if ($portName === '') {
                    continue;
                }

                $portName = preg_replace('/^Port of\s+/i', '', $portName);
                $portName = trim($portName);

                DB::table('shipping_ports')->insert([
                    'country_id' => $countryId,
                    'port_name' => $portName,
                    'active' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->info('Countries imported: ' . DB::table('shipping_countries')->count());
        $this->info('Ports imported: ' . DB::table('shipping_ports')->count());

        return 0;
    }
}