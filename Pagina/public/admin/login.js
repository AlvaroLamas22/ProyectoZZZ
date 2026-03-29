document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.getElementById('login-form');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Cogemos los textos por la fuerza
        const valorUsuario = document.getElementById('usuario').value.trim();
        const valorPassword = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('mensaje-error');

        // Pequeña validación
        if (valorUsuario === '' || valorPassword === '') {
            errorDiv.textContent = 'Por favor, rellena todos los campos.';
            errorDiv.classList.remove('hidden');
            errorDiv.style.color = '#ff4a4a';
            return;
        }

        // Creamos un objeto para mandarlo como JSON
        const datosAEnviar = {
            usuario: valorUsuario,
            password: valorPassword
        };

        try {
            errorDiv.textContent = 'Comprobando credenciales...';
            errorDiv.classList.remove('hidden');
            errorDiv.style.color = 'white';

            const url_backend = 'http://localhost/ProyectoZZZ/ApiRest/login.php'; 

            const respuesta = await fetch(url_backend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosAEnviar)
            });

            const datos = await respuesta.json();

            // Evaluación de la respuesta del PHP
            if (datos.status === 'success') {
                window.location.href = 'panel_admin.php';
            } else {
                errorDiv.textContent = datos.mensaje;
                errorDiv.style.color = '#ff4a4a';
            }
        } catch (error) {
            console.error('Error:', error);
            errorDiv.textContent = 'Error grave de conexión con la API.';
            errorDiv.style.color = '#ff4a4a';
        }
    });
});