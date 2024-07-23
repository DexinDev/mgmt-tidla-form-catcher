<?php
require 'vendor/autoload.php';

use Google\Client;
use Google\Service\Sheets;

function getClient() {
    $client = new Client();
    $client->setApplicationName('Google Sheets API PHP');
    $client->setScopes([Sheets::SPREADSHEETS_READONLY]);
    $client->setAuthConfig(__DIR__ . '/credentials.json');
    $client->setAccessType('offline');
    return $client;
}

$steps = [
    'cosmetic' => false,
    'atp' => false,
    'office' => false,
    'store' => false,
    'rc' => false,
    'general' => false,
    'bf' => false,
    'factory' => false,
    'pharmacy' => false,
    'delivery' => false,
    'final' => false,
];


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);
    $email = $data['email'];
    
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $client = getClient();
        $service = new Sheets($client);

        // ID таблицы и диапазон
        $spreadsheetId = '1AoU58orVL4xyI6IeW1IjW7o2-Hrl5rCp6QfC5pk9AFI';
        $range = 'Sheet1!A1:Z';

        // Чтение данных из таблицы
        $response = $service->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        if (empty($values)) {
            echo json_encode(['error' => 'No data found']);
            exit;
        }

        $headers = array_shift($values);

        $results = [];
        foreach ($values as $row) {
            if (in_array($email, $row)) {
                $rowAssoc = [];
                foreach ($headers as $index => $header) {
                    $rowAssoc[$header] = $row[$index] ?? null;
                }
                $results[] = $rowAssoc;
            }
        }

        foreach($results as $k => $row) {
            foreach($row as $columnName => $columnValue) {
                if($columnValue === '' || $columnValue === null) {
                    unset($results[$k][$columnName]);
                }
            }
        }

        foreach($results as $row) {
            foreach($steps as $k => $v) {
                if(array_key_exists($k, $row) && $row[$k] !== '') $steps[$k] = true;
            }
        }

        header('Content-Type: application/json');
        echo json_encode($steps);

    } else {
        echo json_encode(['error' => 'Invalid email format']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
