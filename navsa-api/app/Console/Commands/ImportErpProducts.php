<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Brand;
use App\Models\SubCategory;
use Illuminate\Support\Facades\DB;

class ImportErpProducts extends Command
{
    protected $signature = 'erp:import {file}';
    protected $description = 'Import products from ERP Excel file';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return 1;
        }

        $this->info("Loading Excel file...");
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        $headers = array_shift($rows);

        $this->info("Detected columns from file header:");
        foreach ($headers as $i => $h) {
            $this->line("  [$i] => $h");
        }
        $this->newLine();

        $total = count($rows);
        $this->info("Found {$total} products to import.");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $imported = 0;
        $skipped  = 0;
        $errors   = 0;
        $unknownCodes = [];

        $suppliers = Supplier::pluck('id', 'supplier_index')->toArray();
        $brands    = Brand::pluck('id', 'brand_name')->toArray();

        // Single source of truth: group_code => [category_id, sub_category_id]
        $subCategoryMap = [];
        foreach (SubCategory::select('id', 'group_code', 'category_id')->get() as $sc) {
            $subCategoryMap[strtoupper($sc->group_code)] = [
                'category_id'     => $sc->category_id,
                'sub_category_id' => $sc->id,
            ];
        }

        $storageMap = DB::table('storage_group_mapping')
    ->pluck('storage_type', 'group_code')
    ->mapWithKeys(fn ($value, $key) => [strtoupper($key) => $value])
    ->toArray();

        if (isset($rows[0])) {
            $this->info("First raw data row (for debugging):");
            foreach ($rows[0] as $i => $val) {
                $label = $headers[$i] ?? "col_$i";
                $this->line("  [$i] $label => " . var_export($val, true));
            }
            $this->newLine();
        }

        foreach ($rows as $rowIndex => $row) {
            try {
                $supplierIndex = trim((string) ($row[0] ?? ''));
                $reference     = trim((string) ($row[1] ?? ''));
                $description   = trim((string) ($row[2] ?? ''));
                $unitsOf       = trim((string) ($row[3] ?? ''));
                $innerCase     = $this->toNumberOrNull($row[4] ?? null);
                $outerCase     = $this->toNumberOrNull($row[5] ?? null);
                $qtyDesc       = trim((string) ($row[6] ?? ''));
                $barcodeEan    = trim((string) ($row[7] ?? ''));
                $barcodeCase   = trim((string) ($row[8] ?? ''));
                $groupDesc     = trim((string) ($row[9] ?? ''));
                $vatCode       = trim((string) ($row[10] ?? ''));
                $layerQty      = $this->toNumberOrNull($row[11] ?? null);
                $palletQty     = $this->toNumberOrNull($row[12] ?? null);
                $supplierRef   = trim((string) ($row[13] ?? ''));
                $cost          = $this->toNumberOrNull($row[14] ?? null);
                $costFromDate  = $this->toDateOrNull($row[15] ?? null);
                $costToDate    = $this->toDateOrNull($row[16] ?? null);
                $weight        = $this->toNumberOrNull($row[17] ?? null);
                $volume        = $this->toNumberOrNull($row[18] ?? null);
                $shelfLife     = $this->toNumberOrNull($row[19] ?? null);
                $bbd           = $this->toDateOrNull($row[20] ?? null);
                $priceList     = trim((string) ($row[21] ?? ''));
                $price         = $this->toNumberOrNull($row[22] ?? null);
                $fromDate      = $this->toDateOrNull($row[23] ?? null);
                $toDate        = $this->toDateOrNull($row[24] ?? null);
                $commCode      = trim((string) ($row[25] ?? ''));
                $intraCountry  = trim((string) ($row[26] ?? ''));
                $intraType     = trim((string) ($row[27] ?? ''));
                $webShortDesc  = trim((string) ($row[28] ?? ''));
                $webLongDesc   = trim((string) ($row[29] ?? ''));
                $webImage      = trim((string) ($row[30] ?? ''));
                $liveForWeb    = $row[31] ?? 0;
                $encoreImage   = trim((string) ($row[32] ?? ''));

                if (empty($description) && empty($reference)) {
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $reference = !empty($reference) ? $reference : null;

                $supplierId = !empty($supplierIndex)
                    ? ($suppliers[trim($supplierIndex)] ?? null)
                    : null;

                $brandName     = null;
                $categoryId    = null;
                $subCategoryId = null;
                $storageType   = 'Ambient';

                if (!empty($groupDesc)) {
                    $cleanGroup = preg_replace('/\s+/', ' ', trim($groupDesc));

                    if (preg_match('/^\S+\s+(.+)$/', $cleanGroup, $matches)) {
                        $brandName = trim($matches[1]);
                    }

                    $groupCode = strtoupper(substr($cleanGroup, 0, 5));
                    $storageType = $storageMap[$groupCode] ?? 'Ambient';

                    if (isset($subCategoryMap[$groupCode])) {
                        $categoryId    = $subCategoryMap[$groupCode]['category_id'];
                        $subCategoryId = $subCategoryMap[$groupCode]['sub_category_id'];
                    } else {
                        $unknownCodes[$groupCode] = ($unknownCodes[$groupCode] ?? 0) + 1;
                    }
                }

                $brandId = null;
                if (!empty($brandName)) {
                    if (!isset($brands[$brandName])) {
                        $brand = Brand::firstOrCreate(
                            ['brand_name' => $brandName],
                            ['status' => 1]
                        );
                        $brands[$brandName] = $brand->id;
                    }
                    $brandId = $brands[$brandName];
                }

                $matchKey = !empty($reference)
                    ? ['reference' => $reference]
                    : ['description' => $description];

                Product::updateOrCreate(
                    $matchKey,
                    [
                        'reference'             => $reference,
                        'supplier_id'           => $supplierId,
                        'category_id'           => $categoryId,
                        'sub_category_id'       => $subCategoryId,
                        'brand_id'              => $brandId,
                        'description'           => $description,
                        'units_of'              => $unitsOf ?: null,
                        'inner_case_quantity'   => $innerCase,
                        'outer_case_quantity'   => $outerCase,
                        'qty_desc'              => $qtyDesc ?: null,
                        'barcode_ean'           => $barcodeEan ?: null,
                        'barcode_case'          => $barcodeCase ?: null,
                        'group_desc'            => $groupDesc ?: null,
                        'storage_type'          => $storageType,
                        'vat_code'              => $vatCode ?: null,
                        'layer_quantity'        => $layerQty,
                        'pallet_quantity'       => $palletQty,
                        'supplier_reference'    => $supplierRef ?: null,
                        'cost'                  => $cost,
                        'cost_from_date'        => $costFromDate,
                        'cost_to_date'          => $costToDate,
                        'weight'                => $weight,
                        'volume'                => $volume,
                        'shelf_life'            => $shelfLife,
                        'bbd'                   => $bbd,
                        'price_list'            => $priceList ?: null,
                        'price'                 => $price,
                        'from_date'             => $fromDate,
                        'to_date'               => $toDate,
                        'comm_code'             => $commCode ?: null,
                        'intra_country'         => $intraCountry ?: null,
                        'intra_type'            => $intraType ?: null,
                        'web_short_description' => $webShortDesc ?: null,
                        'web_long_description'  => $webLongDesc ?: null,
                        'web_image'             => $webImage ?: null,
                        'live_for_web'          => $liveForWeb ? 1 : 0,
                        'encore_image'          => $encoreImage ?: null,
                        'obsolete'              => null,
                    ]
                );

                $imported++;

            } catch (\Exception $e) {
                $errors++;
                $this->newLine();
                $this->error("Row error at index {$rowIndex}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Import complete!");
        $this->info("Imported : {$imported}");
        $this->info("Skipped  : {$skipped}");
        $this->info("Errors   : {$errors}");

        if (!empty($unknownCodes)) {
            $this->newLine();
            $this->warn("⚠️  Unrecognized group codes (no matching sub_category — category left NULL for these products):");
            foreach ($unknownCodes as $code => $count) {
                $this->line("  {$code} — {$count} product(s)");
            }
            $this->warn("Add these codes to the sub_categories table, then re-run this import to backfill them.");
        }

        return 0;
    }

    private function toNumberOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return (float) $value;
        }

        $cleaned = preg_replace('/[^\d.\-]/', '', (string) $value);

        if ($cleaned === '' || !is_numeric($cleaned)) {
            return null;
        }

        return (float) $cleaned;
    }

    private function toDateOrNull($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        if (is_numeric($value)) {
            try {
                return ExcelDate::excelToDateTimeObject($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        $timestamp = strtotime((string) $value);
        return $timestamp ? date('Y-m-d', $timestamp) : null;
    }
}