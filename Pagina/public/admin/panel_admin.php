<?php
    session_start();

    if (!isset($_SESSION['admin_logeado']) || $_SESSION['admin_logeado'] !== true) {
        header("Location: login.html");
        exit();
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Gestión - Wiki ZZZ</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <video autoplay muted loop playsinline id="video-fondo">
          <source src="../video/fondo.webm" type="video/webm">
          
      </video>

    <header>
        <img src="../img/Logo.webp" alt="Logo Proxyhub">
        <h1>PROXYHUB</h1>
        <img src="../img/fondo2.jpg" alt="Decoración">
    </header>

    <main>
        <div class="caja-boceto panel-control-box">
            <h1>PANEL DE CONTROL (ADMIN)</h1>
            <h4>Bienvenido. ¿Qué deseas hacer con la base de datos de agentes?</h4>

            <div class="contenedor-botones-admin">
                <button id="btn-añadir" class="btn-admin">Añadir Personaje</button>

                <button id="btn-modificar" class="btn-admin">Modificar Personaje</button>

                <button id="btn-borrar" class="btn-admin btn-peligro">Borrar Personaje</button>
            </div>

            <br><br>
            
            <a href="../index.html" class="link-salir">
                Cerrar sesión y salir
            </a>

            <div id="contenedor-formulario-admin" class="caja-boceto caja-admin-form" style="display: none;"></div>
        </div>
    </main>

    <footer>
        <p>&copy; 2026 - Sección de Administración Privada</p>
    </footer>
    <script src="admin.js"></script>
</body>
</html>