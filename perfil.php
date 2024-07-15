<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'php_lul/conexion.php';

$response = ['session_active' => false];

// Verificar si hay una sesión activa
if (isset($_SESSION['usuario_id'])) {
    $response['session_active'] = true;

    // Obtener el ID de usuario de la sesión
    $idUsuario = $_SESSION['usuario_id'];

    // Consultar datos del usuario utilizando el ID de sesión
    $queryUsuario = "SELECT nombres, correo FROM usuarios WHERE id = ?";
    $stmtUsuario = $conexion->prepare($queryUsuario);
    if ($stmtUsuario === false) {
        die(json_encode(['error' => 'Error preparando la consulta: ' . $conexion->error]));
    }
    $stmtUsuario->bind_param("i", $idUsuario);
    $stmtUsuario->execute();
    $resultadoUsuario = $stmtUsuario->get_result();

    if ($resultadoUsuario->num_rows > 0) {
        // Obtener datos del usuario
        $filaUsuario = $resultadoUsuario->fetch_assoc();
        $response['nombreUsuario'] = $filaUsuario['nombres'];
        $response['correoUsuario'] = $filaUsuario['correo'];

        // Consultar historial de compras del usuario
        $queryCompras = "SELECT productos, precio, fecha FROM compras WHERE usuario_id = ?";
        $stmtCompras = $conexion->prepare($queryCompras);
        if ($stmtCompras === false) {
            die(json_encode(['error' => 'Error preparando la consulta de compras: ' . $conexion->error]));
        }
        $stmtCompras->bind_param("i", $idUsuario);
        $stmtCompras->execute();
        $resultadoCompras = $stmtCompras->get_result();

        $historialCompras = [];

        // Obtener todas las compras del usuario
        while ($filaCompra = $resultadoCompras->fetch_assoc()) {
            // Decodificar los productos de JSON a array PHP
            $productos = json_decode($filaCompra['productos'], true);
            $historialCompras[] = [
                'fecha' => $filaCompra['fecha'],
                'productos' => $productos,
                'precio' => $filaCompra['precio']
            ];
        }

        // Agregar historial de compras a la respuesta JSON
        $response['historialCompras'] = $historialCompras;

        $stmtCompras->close();

        // Consultar mensajes del usuario utilizando el ID de sesión
        $queryMensajes = "SELECT name, email, subject, message FROM contact_messages WHERE usuario_id = ?";
        $stmtMensajes = $conexion->prepare($queryMensajes);
        if ($stmtMensajes === false) {
            die(json_encode(['error' => 'Error preparando la consulta de mensajes: ' . $conexion->error]));
        }
        $stmtMensajes->bind_param("i", $idUsuario);
        $stmtMensajes->execute();
        $resultadoMensajes = $stmtMensajes->get_result();

        $contactMessages = [];

        // Obtener todos los mensajes del usuario
        while ($filaMensaje = $resultadoMensajes->fetch_assoc()) {
            $contactMessages[] = [
                'name' => $filaMensaje['name'],
                'email' => $filaMensaje['email'],
                'subject' => $filaMensaje['subject'],
                'message' => $filaMensaje['message']
            ];
        }

        // Agregar mensajes a la respuesta JSON
        $response['contactMessages'] = $contactMessages;

        $stmtMensajes->close();
    } else {
        $response['error'] = "No se encontraron datos de usuario";
    }

    $stmtUsuario->close();
} else {
    $response['error'] = "No hay sesión activa";
}

// Establecer el tipo de contenido y enviar la respuesta JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión a la base de datos
$conexion->close();
?>
