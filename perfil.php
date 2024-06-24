<?php
session_start();

include 'conexion.php';

$response = ['session_active' => false];

// Verificar si hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    $response['session_active'] = true;

    // Obtener el ID de usuario de la sesión
    $idUsuario = $_SESSION['usuario_id'];

    // Consultar datos del usuario utilizando el ID de sesión
    $query = "SELECT nombres, correo FROM usuarios WHERE id = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        // Obtener datos del usuario
        $fila = $resultado->fetch_assoc();
        $nombreUsuario = $fila['nombres'];
        $correoUsuario = $fila['correo'];

        // Combinar los datos del usuario con la respuesta JSON
        $response['nombreUsuario'] = $nombreUsuario;
        $response['correoUsuario'] = $correoUsuario;
    } else {
        $response['error'] = "No se encontraron datos de usuario";
    }

    $stmt->close();
} else {
    $response['error'] = "No hay sesión activa";
}

// Establecer el tipo de contenido y enviar la respuesta JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión a la base de datos
$conexion->close();
?>
