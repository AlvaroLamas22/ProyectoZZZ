document.addEventListener('DOMContentLoaded', () => {

    const formAgente = document.getElementById('form-nuevo-agente');
    const btnVolver = document.getElementById('btn-volver');
    
    const BASE_URL_API = 'http://localhost/ProyectoZZZ/ApiRest/'; 

    // Botón para volver
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = 'panel_admin.php';
        });
    }

    // Cargar los datos de los selects
    async function cargarSelect(endpoint, selectIds, campoTexto = 'nombre') {
        try {
            const respuesta = await fetch(BASE_URL_API + endpoint);
            const datos = await respuesta.json();
            
            // Si la API devuelve los datos dentro de un objeto "data", lo usamos. Si no, usamos el array directo.
            const listaItems = datos.data ? datos.data : datos;

            // Recorremos los IDs de los <select> del HTML
            selectIds.forEach(id => {
                const select = document.getElementById(id);
                if (!select) return; // Si no existe, lo saltamos

                // Añadimos una <option> por cada elemento de la base de datos
                listaItems.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id; // El ID real que se guardará en la tabla
                    
                    // Para los materiales, mostramos el tipo entre corchetes para que sea más fácil distinguirlos
                    if (endpoint === 'materiales') {
                        option.textContent = `[${item.tipo}] ${item.nombre}`;
                    } else {
                        option.textContent = item[campoTexto]; // Para el resto, mostramos el nombre
                    }
                    
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error(`Error al cargar datos de ${endpoint}:`, error);
        }
    }

    // Ejecutamos las llamadas a la API justo al cargar la página
    cargarSelect('armas', ['b-arma-1', 'b-arma-2', 'b-arma-3']);
    cargarSelect('discos', ['b-set-4', 'b-set-2']);
    cargarSelect('bangboos', ['eq-bangboo']);
    cargarSelect('materiales', ['req-asc', 'req-hab', 'req-core', 'req-xp', 'req-anillo', 'req-monedas']);

    // --- LÓGICA DINÁMICA PARA EQUIPOS ---
    const btnAddEquipo = document.getElementById('btn-add-equipo');
    const contenedorEquipos = document.getElementById('contenedor-dinamico-equipos');
    let contadorEquipos = 0; // Para dar IDs únicos a los selects generados

    // Función que crea un bloque de equipo nuevo
    function agregarBloqueEquipo() {
        contadorEquipos++;
        const idComp1 = `eq-comp1-dinamico-${contadorEquipos}`;
        const idComp2 = `eq-comp2-dinamico-${contadorEquipos}`;
        const idBangboo = `eq-bangboo-dinamico-${contadorEquipos}`;

        const htmlBloque = `
            <div class="bloque-equipo">
                
                <button type="button" class="btn-peligro btn-eliminar-equipo" onclick="this.parentElement.remove()">X</button>
                
                <div class="form-grid-admin">
                    <div class="col-span-2">
                        <label>Nombre del Equipo:</label>
                        <input type="text" class="input-admin eq-titulo" placeholder="Ej: Físico Premium">
                    </div>
                    <div>
                        <label>Compañero 1:</label>
                        <select id="${idComp1}" class="input-admin eq-comp1">
                            <option value="">Selecciona agente...</option>
                        </select>
                    </div>
                    <div>
                        <label>Compañero 2:</label>
                        <select id="${idComp2}" class="input-admin eq-comp2">
                            <option value="">Selecciona agente...</option>
                        </select>
                    </div>
                    <div>
                        <label>Bangboo:</label>
                        <select id="${idBangboo}" class="input-admin eq-bangboo">
                            <option value="">Selecciona bangboo...</option>
                        </select>
                    </div>
                    <div class="col-span-2">
                        <label>Estrategia:</label>
                        <textarea class="input-admin textarea-admin eq-desc" rows="2" placeholder="Cómo rotar el equipo..."></textarea>
                    </div>
                </div>
            </div>
        `;

        // Insertamos el HTML al final del contenedor
        contenedorEquipos.insertAdjacentHTML('beforeend', htmlBloque);

        // ¡Magia! Rellenamos los <select> que acabamos de crear haciendo una llamada a tu función cargarSelect
        cargarSelect('agentes', [idComp1, idComp2]);
        cargarSelect('bangboos', [idBangboo]);
    }

    // Evento del botón añadir
    if (btnAddEquipo) {
        btnAddEquipo.addEventListener('click', agregarBloqueEquipo);
    }

    // Opcional: Llamamos a la función una vez al principio para que haya al menos 1 caja vacía por defecto
    if (contenedorEquipos) {
        agregarBloqueEquipo();
    }

    // --- LÓGICA DINÁMICA PARA JEFES ---
    const btnAddJefe = document.getElementById('btn-add-jefe');
    const contenedorJefes = document.getElementById('contenedor-dinamico-jefes');
    let contadorJefes = 0;

    function agregarBloqueJefe() {
        contadorJefes++;
        const idJefe = `avj-id-dinamico-${contadorJefes}`;

        const htmlBloque = `
            <div class="bloque-equipo">
                <button type="button" class="btn-peligro btn-eliminar-equipo" onclick="this.parentElement.remove()">X</button>
                
                <div class="form-grid-admin">
                    <div>
                        <label>Jefe (Elite/Boss):</label>
                        <select id="${idJefe}" class="input-admin avj-id">
                            <option value="">Selecciona jefe...</option>
                        </select>
                    </div>
                    <div>
                        <label>Estrategia / Razón:</label>
                        <input type="text" class="input-admin avj-razon" placeholder="Ej: Débil al daño Físico">
                    </div>
                </div>
            </div>
        `;

        contenedorJefes.insertAdjacentHTML('beforeend', htmlBloque);
        cargarSelect('jefes', [idJefe]); // Rellenamos el select del jefe que acabamos de crear
    }

    if (btnAddJefe) {
        btnAddJefe.addEventListener('click', agregarBloqueJefe);
    }

    if (contenedorJefes) {
        agregarBloqueJefe(); // Carga un jefe vacío por defecto
    }


    // Enviar el formulario
    if (formAgente) {
        formAgente.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const msgDiv = document.getElementById('msg-form');
            msgDiv.style.color = 'white';
            msgDiv.textContent = 'Guardando en la base de datos...';

            // Constante con los 20 datos de la tabla agentes
            const datosAgente = {
                nombre: document.getElementById('add-nombre').value.trim(),
                rareza: document.getElementById('add-rareza').value,
                genero: document.getElementById('add-genero').value.trim(),
                elemento: document.getElementById('add-elemento').value.trim(),
                especialidad: document.getElementById('add-especialidad').value.trim(),
                faccion: document.getElementById('add-faccion').value.trim(),
                
                imagen: document.getElementById('add-imagen').value.trim(),
                imagen_full: document.getElementById('add-imagen-full').value.trim(),
                descripcion: document.getElementById('add-desc').value.trim(),
                
                base_hp: document.getElementById('add-hp').value,
                base_atk: document.getElementById('add-atk').value,
                base_def: document.getElementById('add-def').value,
                base_impacto: document.getElementById('add-impacto').value,
                base_prob_crit: document.getElementById('add-prob-crit').value.trim(),
                base_dano_crit: document.getElementById('add-dano-crit').value.trim(),
                base_anomalia_maestria: document.getElementById('add-anomalia-maestria').value,
                base_anomalia_tasa: document.getElementById('add-anomalia-tasa').value,
                base_dano_bruto: document.getElementById('add-dano-bruto').value,
                base_tasa_perforacion: document.getElementById('add-tasa-perf').value.trim(),
                base_recarga_energia: document.getElementById('add-recarga').value.trim(),
                base_adrenalina: document.getElementById('add-adrenalina').value,

                build: {},
                cine_mental: [],
                habilidades: [],
                asc_requisitos: [],
                agente_vs_jefe: [],
                equipos: []
            };

            // --- 1. RECOGER BUILD RECOMENDADA ---
            datosAgente.build = {
                arma_top_1_id: document.getElementById('b-arma-1').value || null,
                arma_top_2_id: document.getElementById('b-arma-2').value || null,
                arma_top_3_id: document.getElementById('b-arma-3').value || null,
                set_4_piezas_id: document.getElementById('b-set-4').value || null,
                set_2_piezas_id: document.getElementById('b-set-2').value || null,
                disco_4_main: document.getElementById('b-disco-4').value.trim() || null,
                disco_5_main: document.getElementById('b-disco-5').value.trim() || null,
                disco_6_main: document.getElementById('b-disco-6').value.trim() || null,
                substats_prioridad: document.getElementById('b-substats').value.trim() || null,
                meta_hp: document.getElementById('b-meta-hp').value.trim() || null,
                meta_atk: document.getElementById('b-meta-atk').value.trim() || null,
                meta_def: document.getElementById('b-meta-def').value.trim() || null,
                meta_prob_crit: document.getElementById('b-meta-prob').value.trim() || null,
                meta_dano_crit: document.getElementById('b-meta-dano').value.trim() || null,
                meta_maestria_anomalia: document.getElementById('b-meta-maestria').value.trim() || null,
                meta_tasa_anomalia: document.getElementById('b-meta-tasa').value.trim() || null,
                meta_recarga: document.getElementById('b-meta-recarga').value.trim() || null,
                meta_impacto: document.getElementById('b-meta-impacto').value.trim() || null,
                meta_tasa_perforacion: document.getElementById('b-meta-perf').value.trim() || null,
                meta_dano_bruto: document.getElementById('b-meta-bruto').value.trim() || null,
                meta_adrenalina: document.getElementById('b-meta-adren').value.trim() || null
            };

            // --- 2. RECOGER CINE MENTAL (6 NIVELES) ---
            for (let i = 1; i <= 6; i++) {
                let nom = document.getElementById('cine-nom-' + i)?.value.trim();
                let desc = document.getElementById('cine-desc-' + i)?.value.trim();
                if (nom || desc) {
                    datosAgente.cine_mental.push({ numero: i, nombre: nom, descripcion: desc });
                }
            }

            // --- 3. RECOGER HABILIDADES (5 HABILIDADES) ---
            const tiposHabilidades = ['Ataque Normal', 'Evasión', 'Técnica Especial', 'Definitiva', 'Pasiva Core', 'Asistencia'];
            tiposHabilidades.forEach((tipo, index) => {
                let num = index + 1;
                let nom = document.getElementById('hab-nom-' + num)?.value.trim();
                let img = document.getElementById('hab-img-' + num)?.value.trim();
                let desc = document.getElementById('hab-desc-' + num)?.value.trim();
                
                // Si el administrador ha escrito al menos el nombre o la descripción, guardamos la habilidad
                if (nom || desc) {
                    datosAgente.habilidades.push({ 
                        nombre: nom || tipo,  // Si no pone EL nombre, usará el tipo por defecto
                        tipo: tipo,           // El tipo siempre es fijo (Ataque Normal, etc)
                        imagen_icono: img || null, 
                        descripcion: desc || '' 
                    });
                }
            });

            // --- 4. RECOGER REQUISITOS (Materiales de mejora) ---

            // Función auxiliar para no repetir código
            const addRequisito = (idInput, cantInput, categoria) => {
                let idVal = document.getElementById(idInput)?.value;
                let cantVal = document.getElementById(cantInput)?.value || 1; // Si no pones cantidad, asume 1
                
                if (idVal) {
                    datosAgente.asc_requisitos.push({
                        material_id: parseInt(idVal),
                        cantidad: parseInt(cantVal),
                        categoria: categoria,
                        nivel_requerido: 60
                    });
                }
            };

            // Recogemos todos los pares de ID/Cantidad y le asignamos su categoría ENUM
            addRequisito('req-asc', 'req-asc-cant', 'ASCENSION');
            addRequisito('req-hab', 'req-hab-cant', 'HABILIDAD');
            addRequisito('req-core', 'req-core-cant', 'CORE');
            addRequisito('req-xp', 'req-xp-cant', 'ASCENSION');        // La XP va como Ascensión
            addRequisito('req-anillo', 'req-anillo-cant', 'HABILIDAD'); // El anillo es para Habilidades
            addRequisito('req-monedas', 'req-monedas-cant', 'ASCENSION'); // Las monedas van como Ascensión

            // --- 5. RECOGER AGENTE VS JEFE ---
            // Buscamos todas las cajas de jefes que estén dentro de su contenedor
            const bloquesJefes = document.querySelectorAll('#contenedor-dinamico-jefes .bloque-equipo');

            bloquesJefes.forEach(bloque => {
                let jefeId = bloque.querySelector('.avj-id').value;
                let jefeRazon = bloque.querySelector('.avj-razon').value.trim();

                // Solo si el usuario ha seleccionado un jefe de la lista lo guardamos
                if (jefeId) {
                    datosAgente.agente_vs_jefe.push({
                        jefe_id: parseInt(jefeId),
                        razon_ventaja: jefeRazon
                    });
                }
            });

            // --- 6. RECOGER EQUIPO RECOMENDADO ---
            const bloquesEquipos = document.querySelectorAll('.bloque-equipo');

            bloquesEquipos.forEach(bloque => {
                // Buscamos los valores DENTRO de esta caja en concreto usando sus CLASES
                let eqTitulo = bloque.querySelector('.eq-titulo').value.trim();
                let eqComp1 = bloque.querySelector('.eq-comp1').value;
                let eqComp2 = bloque.querySelector('.eq-comp2').value;
                let eqBangboo = bloque.querySelector('.eq-bangboo').value;
                let eqDesc = bloque.querySelector('.eq-desc').value.trim();

                // Si al menos han seleccionado a un compañero, guardamos el equipo en el array
                if (eqComp1 || eqComp2) {
                    datosAgente.equipos.push({
                        titulo_equipo: eqTitulo || 'Equipo Recomendado',
                        compañero_1_id: eqComp1 ? parseInt(eqComp1) : null,
                        compañero_2_id: eqComp2 ? parseInt(eqComp2) : null,
                        bangboo_id: eqBangboo ? parseInt(eqBangboo) : null,
                        descripcion_estrategia: eqDesc || ''
                    });
                }
            });

            try {
                const respuesta = await fetch(BASE_URL_API + 'agentes', {
                    method: 'POST',
                    credentials: 'include', // Verifica que este logueado
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAgente)
                });
                
                const resultado = await respuesta.json();
                
                if (resultado.status === 'success') {
                    msgDiv.style.color = '#28a745';
                    msgDiv.textContent = '¡Agente creado con éxito! ID asignado: ' + resultado.id;
                    // Deja los valores por defecto del HTML
                    formAgente.reset(); 
                } else {
                    msgDiv.style.color = '#ff4a4a';
                    msgDiv.textContent = 'Error: ' + resultado.mensaje;
                }
            } catch (error) {
                console.error(error);
                msgDiv.style.color = '#ff4a4a';
                msgDiv.textContent = 'Error de conexión con el servidor.';
            }
        });
    }
});