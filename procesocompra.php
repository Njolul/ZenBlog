<?php

session_start();
if (!isset($_SESSION['usuario'])) {
    echo 'error';
    exit();
}

include 'conexion.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_SESSION['usuario'];
    $cardNumber = $_POST['card_number'];
    $expiryDate = $_POST['expiry_date'];
    $cvv = $_POST['cvv'];
    $cart = json_decode($_POST['cart'], true);
    $total = $_POST['total'];

    foreach ($cart as $item) {
        $doctorName = $item['doctor_name'];
        $price = $item['price'];
        $quantity = $item['quantity'];
        $totalPrice = $price * $quantity;

        $stmt = $conn->prepare("INSERT INTO orders (username, doctor_name, doctor_price, quantity, total_price, card_number, expiry_date, cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiiisss", $username, $doctorName, $price, $quantity, $totalPrice, $cardNumber, $expiryDate, $cvv);

        if (!$stmt->execute()) {
            echo "fail";
            exit;
        }
    }

    echo "Exitoso";
}

$conn->close();
?>