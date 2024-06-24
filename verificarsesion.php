<?php
session_start();
$response = ['session_active' => false];
if (isset($_SESSION['usuario'])) {
    $response['session_active'] = true;
}
header('Content-Type: application/json');
echo json_encode($response);
?>