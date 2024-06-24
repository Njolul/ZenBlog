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
    $queryUsuario = "SELECT nombres, correo FROM usuarios WHERE id = ?";
    $stmtUsuario = $conexion->prepare($queryUsuario);
    $stmtUsuario->bind_param("i", $idUsuario);
    $stmtUsuario->execute();
    $resultadoUsuario = $stmtUsuario->get_result();

    if ($resultadoUsuario->num_rows > 0) {
        // Obtener datos del usuario
        $filaUsuario = $resultadoUsuario->fetch_assoc();
        $nombreUsuario = $filaUsuario['nombres'];
        $correoUsuario = $filaUsuario['correo'];

        // Combinar los datos del usuario con la respuesta JSON
        $response['nombreUsuario'] = $nombreUsuario;
        $response['correoUsuario'] = $correoUsuario;

        // Consultar historial de compras del usuario
        $queryCompras = "SELECT productos, precio, fecha FROM compras WHERE usuario_id = ?";
        $stmtCompras = $conexion->prepare($queryCompras);
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
