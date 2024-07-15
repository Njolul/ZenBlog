<?php
session_start();
include 'conexion.php';

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(array(
        'success' => false,
        'message' => 'Usuario no autenticado',
        'error_type' => 'no_autenticado'
    ));
    exit();
}

// Obtener ID de usuario desde la sesión
$usuario_id = $_SESSION['usuario_id'];

// Preparar la consulta SQL para verificar si el usuario tiene una tarjeta guardada
$sql = "SELECT COUNT(*) as count FROM tarjeta_cliente WHERE usuario_id = ?";

if ($stmt = $conexion->prepare($sql)) {
    // Vincular parámetros
    $stmt->bind_param("i", $usuario_id);
    // Ejecutar la consulta
    $stmt->execute();
    // Obtener el resultado
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        // El usuario tiene al menos una tarjeta guardada
        echo json_encode(array(
            'success' => true,
            'tarjetaRegistrada' => true,
            'message' => 'Tarjeta encontrada'
        ));
    } else {
        // El usuario no tiene tarjetas guardadas
        echo json_encode(array(
            'success' => true,
            'tarjetaRegistrada' => false,
            'message' => 'No se encontró ninguna tarjeta'
        ));
    }

    // Cerrar la sentencia
    $stmt->close();
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Error al preparar la consulta: ' . $conexion->error,
        'error_type' => 'bd_error'
    ));
}

// Cerrar la conexión a la base de datos
$conexion->close();
?>
