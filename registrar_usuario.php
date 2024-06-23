<?php
include 'conexion.php';

// Verificar que se reciben todos los datos necesarios
if (isset($_POST['nombres'], $_POST['apellidos'], $_POST['correo'], $_POST['contrasena'])) {
    // Sanitizar y asignar los valores recibidos
    $nombres = $_POST['nombres'];
    $apellidos = $_POST['apellidos'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Verificar si algún campo está vacío
    $errors = array();
    if (empty($nombres)) {
        $errors[] = array('field' => 'nombres', 'message' => 'Por favor ingrese su nombre');
    }
    if (empty($apellidos)) {
        $errors[] = array('field' => 'apellidos', 'message' => 'Por favor ingrese su apellido');
    }
    if (empty($correo)) {
        $errors[] = array('field' => 'correo', 'message' => 'Por favor ingrese su correo electrónico');
    }
    if (empty($contrasena)) {
        $errors[] = array('field' => 'contrasena', 'message' => 'Por favor ingrese su contraseña');
    }

    if (!empty($errors)) {
        $response = array(
            'success' => false,
            'message' => 'Error: ',
            'errors' => $errors
        );
    } else {
        // Preparar la consulta SQL con sentencia preparada
        $sql = "INSERT INTO usuarios (nombres, apellidos, correo, contrasena) VALUES (?, ?, ?, ?)";
        
        // Preparar la sentencia
        $stmt = $conexion->prepare($sql);
        
        // Vincular parámetros
        $stmt->bind_param("ssss", $nombres, $apellidos, $correo, $contrasena);
        
        // Ejecutar la sentencia
        if ($stmt->execute()) {
            $response = array(
                'success' => true,
                'message' => '¡Te has registrado exitosamente!'
            );
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error al registrar usuario: ' . $stmt->error,
                'error_type' => 'bd_error'
            );
        }

        // Cerrar la sentencia preparada
        $stmt->close();
    }
} else {
    // Enviar un mensaje de error si no se reciben todos los datos esperados
    $response = array(
        'success' => false,
        'message' => 'Error: Todos los campos son obligatorios.',
        'error_type' => 'campo_vacio'
    );
}

// Cerrar la conexión
$conexion->close();

// Devolver respuesta en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>