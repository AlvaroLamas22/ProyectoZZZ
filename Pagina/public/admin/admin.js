document.addEventListener('DOMContentLoaded', () => {
    
    const btnAnadir = document.getElementById('btn-añadir');
    const btnBorrar = document.getElementById('btn-borrar');
    const btnModificar = document.getElementById('btn-modificar');
    const BASE_URL_API = 'http://localhost/ProyectoZZZ/ApiRest/';

    // 1. BOTÓN AÑADIR: Lleva a la página insertar
    if (btnAnadir) {
        btnAnadir.addEventListener('click', () => {
            window.location.href = 'insertar.php';
        });
    }

    // 2. BOTÓN BORRAR: Prompt para borrar el personaje
    if (btnBorrar) {
        btnBorrar.addEventListener('click', async () => {
            const nombreBorrar = prompt("PELIGRO \nIntroduce el nombre EXACTO del agente que quieres borrar para siempre:");
            
            if (!nombreBorrar || nombreBorrar.trim() === '') return;

            if (confirm(`¿Estás 100% seguro de que quieres borrar a ${nombreBorrar} y TODAS sus habilidades y datos?`)) {
                
                try {
                    const respuesta = await fetch(BASE_URL_API + 'agentes', {
                        method: 'DELETE',
                        credentials: 'include', // Verifica que esta logueado 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre: nombreBorrar.trim() })
                    });

                    const resultado = await respuesta.json();

                    if (resultado.status === 'success') {
                        alert(resultado.mensaje);
                    } else {
                        alert('Error: ' + resultado.mensaje);
                    }
                } catch (error) {
                    alert('Error de conexión con la API.');
                }
            }
        });
    }
	
	// 3. BOTÓN MODIFICAR: Lleva a la página modificar
    if (btnModificar) {
        btnModificar.addEventListener('click', () => {
            window.location.href = 'modificar.php';
        });
    }
});