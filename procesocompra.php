<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    echo 'error';
    exit();
}

include 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario_id = $_SESSION['usuario']; // Obtener el ID de usuario desde la sesión
    $cardNumber = $_POST['card_number'];
    $expiryDate = $_POST['expiry_date'];
    $cvv = $_POST['cvv'];
    $cart = json_decode($_POST['cart'], true);
    $total = $_POST['total']; // Aunque se elimina, ya que no se usa en esta versión.

    // Preparar la consulta para insertar en la tabla tarjeta_cliente
    $stmt = $conn->prepare("INSERT INTO tarjeta_cliente (usuario_id, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $usuario_id, $cardNumber, $expiryDate, $cvv);

    if ($stmt->execute()) {
        echo "Exitoso";
    } else {
        echo "fail";
    }

    $stmt->close();
}

$conn->close();
?>


