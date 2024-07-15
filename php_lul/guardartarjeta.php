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

// Verificar si la solicitud es un POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(array(
        'success' => false,
        'message' => 'Método de solicitud no válido',
        'error_type' => 'metodo_invalido'
    ));
    exit();
}

// Obtener ID de usuario desde la sesión
$usuario_id = $_SESSION['usuario_id'];

// Obtener datos del formulario
$rut = $_POST['rut'];
$cardNumber = $_POST['card_number'];
$expiryDate = $_POST['expiry_date'];
$cvv = $_POST['cvv'];

// Validar campos obligatorios
$errors = array();
if (empty($rut)) {
    $errors[] = array('field' => 'rut', 'message' => 'Por favor ingrese su RUT');
}
if (empty($cardNumber)) {
    $errors[] = array('field' => 'card_number', 'message' => 'Por favor ingrese el número de tarjeta');
}
if (empty($expiryDate)) {
    $errors[] = array('field' => 'expiry_date', 'message' => 'Por favor ingrese la fecha de expiración');
}
if (empty($cvv)) {
    $errors[] = array('field' => 'cvv', 'message' => 'Por favor ingrese el CVV');
}

// Procesar datos si no hay errores
if (empty($errors)) {
    // Preparar la consulta SQL con sentencia preparada
    $sql = "INSERT INTO tarjeta_cliente (usuario_id, rut, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?, ?)";

    // Preparar la sentencia
    if ($stmt = $conexion->prepare($sql)) {
        // Vincular parámetros
        $stmt->bind_param("issss", $usuario_id, $rut, $cardNumber, $expiryDate, $cvv);

        // Ejecutar la sentencia
        if ($stmt->execute()) {
            $response = array(
                'success' => true,
                'message' => '¡Tarjeta registrada exitosamente!'
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error al registrar tarjeta: ' . $stmt->error,
                'error_type' => 'bd_error'
            );
        }

        // Cerrar la sentencia preparada
        $stmt->close();
    } else {
        $response = array(
            'success' => false,
            'message' => 'Error al preparar la consulta: ' . $conexion->error,
            'error_type' => 'bd_error'
        );
    }
} else {
    // Hay errores en los datos recibidos
    $response = array(
        'success' => false,
        'message' => 'Error en los datos ingresados',
        'errors' => $errors
    );
}

// Cerrar la conexión a la base de datos
$conexion->close();

// Devolver respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
