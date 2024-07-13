<?php
session_start();
include 'conexion.php';

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    exit();
}

// Verificar si la solicitud es un POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit();
}

// Leer los datos desde la entrada estándar
$data = json_decode(file_get_contents('php://input'), true);

// Obtener y sanitizar datos del formulario
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

// Validar los datos
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
  $response = ['success' => false, 'message' => 'Por favor, completa todos los campos .'];
  header('Content-Type: application/json');
   echo json_encode($response);
    exit();
}

// Preparar la consulta SQL para insertar en la tabla contact_messages
$sql = "INSERT INTO contact_messages (usuario_id, name, email, subject, message) 
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

// Verificar si la preparación de la consulta fue exitosa
if ($stmt === false) {
    $response = ['success' => false, 'message' => 'Error en la preparación de la consulta.'];
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

// Vincular parámetros y ejecutar la consulta
$stmt->bind_param("issss", $_SESSION['usuario_id'], $name, $email, $subject, $message);

try {
    // Ejecutar la consulta
    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Mensaje enviado correctamente. ¡Gracias!'];
    } else {
        $response = ['success' => false, 'message' => 'Error al enviar el mensaje.'];
    }
} catch (Exception $e) {
    $response = ['success' => false, 'message' => 'Error al enviar el mensaje: ' . $e->getMessage()];
} finally {
    // Cerrar la conexión y liberar recursos
    $stmt->close();
    $conexion->close();
}

// Devolver respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>