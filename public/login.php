<?php
    // 1. Iniciamos la sesión
    session_start();

    // 2. Incluimos el archivo de conexión a la BD
    require_once __DIR__. '/include/conexion.php'; 

    // 3. Leemos el JSON que nos envía el frontend
    $json_crudo = file_get_contents('php://input');
    $datos_recibidos = json_decode($json_crudo, true);

    // Extraemos las credenciales
    $usuario_introducido = $datos_recibidos['usuario'] ?? '';
    $password_introducido = $datos_recibidos['password'] ?? '';

    // 4. Buscamos en la BD al usuario de forma segura
    $sql = "SELECT * FROM usuarios WHERE nombre = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(1, $usuario_introducido);
    $stmt->execute();

    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    // 5. Validación de seguridad (Usuario existe y clave coincide)
    if ($admin && password_verify($password_introducido, $admin['password'])) {
        
        // ¡LOGIN CORRECTO! Regeneramos el ID de sesión por seguridad
        session_regenerate_id(true);

        // Asignamos las variables de sesión
        $_SESSION['admin_logeado'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_nombre'] = $admin['nombre'];
        
        // Devolvemos el OK al frontend
        echo json_encode(["status" => "success", "mensaje" => "Login correcto"]);
        exit();

    } else {
        // ¡LOGIN FALLIDO! Mensaje genérico para no dar pistas a atacantes
        echo json_encode(["status" => "error", "mensaje" => "Usuario o contraseña incorrectos"]);
        exit();
    }
?>