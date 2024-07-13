<?php
session_start();
include 'conexion.php';

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    exit();
}

// Obtener datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Preparar los datos para insertar en la base de datos
$usuario_id = $_SESSION['usuario_id'];
$productos = json_encode($data['productos']); // Convertir array de productos a JSON
$precioTotal = $data['precioTotal'];
$fecha = date('Y-m-d H:i:s'); // Obtener fecha actual

// Preparar la consulta SQL para insertar la compra
$query = "INSERT INTO compras (usuario_id, productos, precio, fecha) VALUES (?, ?, ?, ?)";
$stmt = $conexion->prepare($query);
$stmt->bind_param("isds", $usuario_id, $productos, $precioTotal, $fecha);

// Ejecutar la consulta
if ($stmt->execute()) {
    $response = array('success' => true, 'message' => 'Compra guardada correctamente');
} else {
    $response = array('success' => false, 'message' => 'Error al guardar la compra: ' . $stmt->error);
}

// Cerrar la conexión y devolver la respuesta en JSON
$stmt->close();
$conexion->close();
header('Content-Type: application/json');
echo json_encode($response);
?>
