<?php
require 'vendor/autoload.php';

$spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load('Datafeed_from_ERP_system.xlsx');
$sheet = $spreadsheet->getActiveSheet();
$rows = $sheet->toArray(null, true, true, false);
array_shift($rows);

echo "Total rows: " . count($rows) . "\n";

$emptyDesc = 0;
$emptyRef = 0;
foreach ($rows as $row) {
    if (empty(trim($row[2] ?? ''))) $emptyDesc++;
    if (empty(trim($row[1] ?? ''))) $emptyRef++;
}

echo "Empty description: " . $emptyDesc . "\n";
echo "Empty reference: " . $emptyRef . "\n";
echo "ROW 1:\n";
print_r($rows[0]);
echo "ROW 2:\n";
print_r($rows[1]);