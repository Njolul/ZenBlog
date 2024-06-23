<?php
session_start();

include 'conexion.php';

// Verificar que se reciben todos los datos necesarios
if (isset($_POST['correo'], $_POST['contrasena'])) {
    // Sanitizar y asignar los valores recibidos
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    // Verificar si algún campo está vacío
    $errors = array();
    if (empty($correo)) {
        $errors[] = array('field' => 'correo', 'message' => 'Por favor ingrese su correo electrónico', 'error_type' => 'campo_vacio');
    }
    if (empty($contrasena)) {
        $errors[] = array('field' => 'contrasena', 'message' => 'Por favor ingrese su contraseña', 'error_type' => 'campo_vacio');
    }

    if (!empty($errors)) {
        $response = array(
            'success' => false,
            'message' => 'Error en la autenticación',
            'errors' => $errors
        );
    } else {
        // Verificar si el correo electrónico está registrado
        $sql = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $usuario = $result->fetch_assoc();

            // Verificar la contraseña en texto plano (sin encriptar)
            if ($contrasena === $usuario['contrasena']) {
                // Iniciar sesión correctamente
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nombre'] = $usuario['nombres'];
                $_SESSION['usuario_apellidos'] = $usuario['apellidos'];
                $_SESSION['usuario_correo'] = $usuario['correo'];

                // Regenerar el ID de sesión para prevenir ataques de fijación de sesión
                session_regenerate_id();

                $response = array(
                    'success' => true,
                    'message' => '¡Has iniciado sesión exitosamente!',
                    'session' => array(
                        'usuario_id' => $_SESSION['usuario_id'],
                        'usuario_nombre' => $_SESSION['usuario_nombre'],
                        'usuario_apellidos' => $_SESSION['usuario_apellidos'],
                        'usuario_correo' => $_SESSION['usuario_correo']
                    )
                );
            } else {
                $response = array(
                    'success' => false,
                    'message' => 'Error: Contraseña incorrecta',
                    'error_type' => 'contrasena_incorrecta'
                );
            }
        } else {
            $response = array(
                'success' => false,
                'message' => 'Error: Correo electrónico no registrado',
                'error_type' => 'correo_no_registrado'
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
