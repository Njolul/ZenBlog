<?php
$servidor = "localhost"; // Cambia esto por la dirección de tu servidor MySQL
$usuario = "root"; // Cambia esto por tu usuario de MySQL
$contrasena = ""; // Cambia esto por tu contraseña de MySQL
$base_datos = "miprimerachamba"; // Cambia esto por el nombre de tu base de datos

// Crear conexión
$conexion = new mysqli($servidor, $usuario, $contrasena, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("La conexión ha fallado: " . $conexion->connect_error);
}
?>