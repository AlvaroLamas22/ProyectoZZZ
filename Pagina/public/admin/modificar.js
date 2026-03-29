document.addEventListener('DOMContentLoaded', async () => {

    const formModificar = document.getElementById('form-modificar-agente');
    const selectAgente = document.getElementById('select-agente');
    const btnVolver = document.getElementById('btn-volver-mod');
    const btnGuardar = document.getElementById('btn-guardar-mod');
    const msgDiv = document.getElementById('msg-form-mod');
    
    const BASE_URL_API = 'http://localhost/ProyectoZZZ/ApiRest/'; 

    // 1. Botón para volver al panel
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = 'panel_admin.php';
        });
    }

    // -----------------------------------------------------------------
    // CARGAR LOS SELECTS DINÁMICAMENTE DESDE LA BASE DE DATOS
    // -----------------------------------------------------------------
    async function cargarSelect(endpoint, selectIds, campoTexto = 'nombre') {
        try {
            const respuesta = await fetch(BASE_URL_API + endpoint);
            const datos = await respuesta.json();
            const listaItems = datos.data ? datos.data : datos;

            selectIds.forEach(id => {
                const select = document.getElementById(id);
                if (!select) return;

                listaItems.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    if (endpoint === 'materiales') {
                        option.textContent = `[${item.tipo}] ${item.nombre}`;
                    } else {
                        option.textContent = item[campoTexto];
                    }
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error(`Error al cargar datos de ${endpoint}:`, error);
        }
    }

    // Ejecutamos las llamadas a la API justo al cargar la página
    cargarSelect('armas', ['mod-b-arma-1', 'mod-b-arma-2', 'mod-b-arma-3']);
    cargarSelect('discos', ['mod-b-set-4', 'mod-b-set-2']);
    cargarSelect('materiales', ['mod-req-asc', 'mod-req-hab', 'mod-req-core', 'mod-req-xp', 'mod-req-anillo', 'mod-req-monedas']);


    // 2. Cargar la lista de agentes en el <select> principal
    try {
        const respuesta = await fetch(BASE_URL_API + 'agentes');
        const agentes = await respuesta.json();

        selectAgente.innerHTML = '<option value="">-- Selecciona un personaje --</option>';
        agentes.forEach(agente => {
            const option = document.createElement('option');
            option.value = agente.id;
            option.textContent = agente.nombre;
            selectAgente.appendChild(option);
        });
    } catch (error) {
        selectAgente.innerHTML = '<option value="">Error al cargar agentes</option>';
        console.error('Error cargando la lista:', error);
    }

    // --- FUNCIONES DINÁMICAS PARA JEFES Y EQUIPOS ---
    const btnAddJefe = document.getElementById('btn-add-jefe');
    const contenedorJefes = document.getElementById('contenedor-dinamico-jefes');
    let contadorJefes = 0;

    async function agregarBloqueJefe(datosJefe = null) {
        contadorJefes++;
        const idJefe = `avj-id-dinamico-${contadorJefes}`;

        const htmlBloque = `
            <div class="bloque-equipo">
                <button type="button" class="btn-peligro btn-eliminar-equipo btn-dinamico" onclick="this.parentElement.remove()">X</button>
                <div class="form-grid-admin">
                    <div>
                        <label>Jefe (Elite/Boss):</label>
                        <select id="${idJefe}" class="input-admin avj-id"><option value="">Selecciona jefe...</option></select>
                    </div>
                    <div>
                        <label>Estrategia / Razón:</label>
                        <input type="text" class="input-admin avj-razon" placeholder="Ej: Débil al daño Físico" value="${datosJefe ? (datosJefe.razon_ventaja || '') : ''}">
                    </div>
                </div>
            </div>
        `;
        contenedorJefes.insertAdjacentHTML('beforeend', htmlBloque);

        await cargarSelect('jefes', [idJefe]); // Esperamos a que se rellene
        if (datosJefe && datosJefe.jefe_id) document.getElementById(idJefe).value = datosJefe.jefe_id;
    }

    const btnAddEquipo = document.getElementById('btn-add-equipo');
    const contenedorEquipos = document.getElementById('contenedor-dinamico-equipos');
    let contadorEquipos = 0;

    async function agregarBloqueEquipo(datosEq = null) {
        contadorEquipos++;
        const idComp1 = `eq-comp1-dinamico-${contadorEquipos}`;
        const idComp2 = `eq-comp2-dinamico-${contadorEquipos}`;
        const idBangboo = `eq-bangboo-dinamico-${contadorEquipos}`;

        const htmlBloque = `
            <div class="bloque-equipo">
                <button type="button" class="btn-peligro btn-eliminar-equipo btn-dinamico" onclick="this.parentElement.remove()">X</button>
                <div class="form-grid-admin" style="margin-top: 5px;">
                    <div class="col-span-2">
                        <label>Nombre del Equipo:</label>
                        <input type="text" class="input-admin eq-titulo" placeholder="Ej: Físico Premium" value="${datosEq ? (datosEq.titulo_equipo || '') : ''}">
                    </div>
                    <div>
                        <label>Compañero 1:</label>
                        <select id="${idComp1}" class="input-admin eq-comp1"><option value="">Selecciona agente...</option></select>
                    </div>
                    <div>
                        <label>Compañero 2:</label>
                        <select id="${idComp2}" class="input-admin eq-comp2"><option value="">Selecciona agente...</option></select>
                    </div>
                    <div class="col-span-2">
                        <label>Bangboo:</label>
                        <select id="${idBangboo}" class="input-admin eq-bangboo"><option value="">Selecciona bangboo...</option></select>
                    </div>
                    <div class="col-span-2">
                        <label>Estrategia:</label>
                        <textarea class="input-admin textarea-admin eq-desc" rows="2" placeholder="Cómo rotar el equipo...">${datosEq ? (datosEq.descripcion_estrategia || '') : ''}</textarea>
                    </div>
                </div>
            </div>
        `;
        contenedorEquipos.insertAdjacentHTML('beforeend', htmlBloque);

        await Promise.all([cargarSelect('agentes', [idComp1, idComp2]), cargarSelect('bangboos', [idBangboo])]);

        if (datosEq) {
            document.getElementById(idComp1).value = datosEq.compañero_1_id || '';
            document.getElementById(idComp2).value = datosEq.compañero_2_id || '';
            document.getElementById(idBangboo).value = datosEq.bangboo_id || '';
        }
    }

    if (btnAddJefe) btnAddJefe.addEventListener('click', () => agregarBloqueJefe());
    if (btnAddEquipo) btnAddEquipo.addEventListener('click', () => agregarBloqueEquipo());

    // -----------------------------------------------------------------
    // 3. CUANDO SE SELECCIONA UN AGENTE: RELLENAR TODO EL FORMULARIO
    // -----------------------------------------------------------------
    selectAgente.addEventListener('change', async (e) => {
        const idSeleccionado = e.target.value;

        if (!idSeleccionado) {
            formModificar.reset();
            bloquearFormulario(true);
            return;
        }

        msgDiv.style.color = 'white';
        msgDiv.textContent = 'Cargando expediente completo...';
        bloquearFormulario(true); // Bloqueamos mientras carga

        try {
            const respuesta = await fetch(BASE_URL_API + 'agentes/' + idSeleccionado);
            const datos = await respuesta.json();

            if (datos && datos.info) {
                // Limpiamos el formulario por si había datos de otro personaje anterior
                formModificar.reset();
                selectAgente.value = idSeleccionado; // Restauramos el select principal

                // A. INFO BASE
                const info = datos.info;
                document.getElementById('mod-id').value = info.id;
                document.getElementById('mod-nombre').value = info.nombre;
                document.getElementById('mod-rareza').value = info.rareza;
                document.getElementById('mod-genero').value = info.genero || '';
                document.getElementById('mod-elemento').value = info.elemento;
                document.getElementById('mod-especialidad').value = info.especialidad;
                document.getElementById('mod-faccion').value = info.faccion || '';
                document.getElementById('mod-imagen').value = info.imagen || '';
                document.getElementById('mod-imagen-full').value = info.imagen_full || '';
                document.getElementById('mod-desc').value = info.descripcion || '';
                document.getElementById('mod-hp').value = info.base_hp;
                document.getElementById('mod-atk').value = info.base_atk;
                document.getElementById('mod-def').value = info.base_def;
                document.getElementById('mod-impacto').value = info.base_impacto;
                document.getElementById('mod-prob-crit').value = info.base_prob_crit;
                document.getElementById('mod-dano-crit').value = info.base_dano_crit;
                document.getElementById('mod-anomalia-maestria').value = info.base_anomalia_maestria;
                document.getElementById('mod-anomalia-tasa').value = info.base_anomalia_tasa;
                document.getElementById('mod-dano-bruto').value = info.base_dano_bruto;
                document.getElementById('mod-tasa-perf').value = info.base_tasa_perforacion;
                document.getElementById('mod-recarga').value = info.base_recarga_energia;
                document.getElementById('mod-adrenalina').value = info.base_adrenalina || 0;

                // B. BUILD RECOMENDADA
                if (datos.build) {
                    const b = datos.build;
                    document.getElementById('mod-b-arma-1').value = b.arma_top_1_id || '';
                    document.getElementById('mod-b-arma-2').value = b.arma_top_2_id || '';
                    document.getElementById('mod-b-arma-3').value = b.arma_top_3_id || '';
                    document.getElementById('mod-b-set-4').value = b.set_4_piezas_id || '';
                    document.getElementById('mod-b-set-2').value = b.set_2_piezas_id || '';
                    document.getElementById('mod-b-substats').value = b.substats_prioridad || '';
                    document.getElementById('mod-b-disco-4').value = b.disco_4_main || '';
                    document.getElementById('mod-b-disco-5').value = b.disco_5_main || '';
                    document.getElementById('mod-b-disco-6').value = b.disco_6_main || '';
                    document.getElementById('mod-b-meta-hp').value = b.meta_hp || '';
                    document.getElementById('mod-b-meta-atk').value = b.meta_atk || '';
                    document.getElementById('mod-b-meta-def').value = b.meta_def || '';
                    document.getElementById('mod-b-meta-prob').value = b.meta_prob_crit || '';
                    document.getElementById('mod-b-meta-dano').value = b.meta_dano_crit || '';
                    document.getElementById('mod-b-meta-maestria').value = b.meta_maestria_anomalia || '';
                    document.getElementById('mod-b-meta-tasa').value = b.meta_tasa_anomalia || '';
                    document.getElementById('mod-b-meta-recarga').value = b.meta_recarga || '';
                    document.getElementById('mod-b-meta-impacto').value = b.meta_impacto || '';
                    document.getElementById('mod-b-meta-perf').value = b.meta_tasa_perforacion || '';
                    document.getElementById('mod-b-meta-bruto').value = b.meta_dano_bruto || '';
                    document.getElementById('mod-b-meta-adren').value = b.meta_adrenalina || '';
                }

                // C. HABILIDADES
                if (datos.habilidades && datos.habilidades.length > 0) {
                    datos.habilidades.forEach((hab, idx) => {
                        let num = idx + 1;
                        if(num <= 6) { // Máximo 6 habilidades
                            document.getElementById('mod-hab-nom-' + num).value = hab.nombre || '';
                            document.getElementById('mod-hab-img-' + num).value = hab.imagen_icono || '';
                            document.getElementById('mod-hab-desc-' + num).value = hab.descripcion || '';
                        }
                    });
                }

                // D. CINE MENTAL
                if (datos.discos_mentales && datos.discos_mentales.length > 0) {
                    datos.discos_mentales.forEach(cine => {
                        let num = cine.numero;
                        if (document.getElementById('mod-cine-nom-' + num)) {
                            document.getElementById('mod-cine-nom-' + num).value = cine.nombre || '';
                            document.getElementById('mod-cine-desc-' + num).value = cine.descripcion || '';
                        }
                    });
                }

                // E. AGENTE VS JEFE (Dinamico)
                contenedorJefes.innerHTML = ''; // Limpiamos las cajas anteriores
                if (datos.ventajas && datos.ventajas.length > 0) {
                    for (const jefe of datos.ventajas) {
                        await agregarBloqueJefe(jefe);
                    }
                }

                // F. EQUIPOS RECOMENDADOS (Dinamico)
                contenedorEquipos.innerHTML = ''; // Limpiamos las cajas anteriores
                if (datos.equipos && datos.equipos.length > 0) {
                    for (const eq of datos.equipos) {
                        await agregarBloqueEquipo(eq);
                    }
                }

                // G. MATERIALES (Requiere que el PHP devuelva material_id)
                if (datos.materiales && datos.materiales.length > 0) {
                    // Limpiamos primero por si acaso
                    ['mod-req-asc', 'mod-req-hab', 'mod-req-core', 'mod-req-xp', 'mod-req-anillo', 'mod-req-monedas'].forEach(id => document.getElementById(id).value = '');
                    ['mod-req-asc-cant', 'mod-req-hab-cant', 'mod-req-core-cant', 'mod-req-xp-cant', 'mod-req-anillo-cant', 'mod-req-monedas-cant'].forEach(id => document.getElementById(id).value = '');

                    // Asignamos según el ID y la lógica del juego
                    // Como la BD solo devuelve "ASCENSION", "HABILIDAD" o "CORE", tenemos que adivinar 
                    // cuál es la XP y cuáles las Monedas basándonos en cantidades altas, o si es el Anillo.
                    datos.materiales.forEach(mat => {
                        if (mat.categoria === 'CORE') {
                            document.getElementById('mod-req-core').value = mat.material_id;
                            document.getElementById('mod-req-core-cant').value = mat.cantidad;
                        } 
                        else if (mat.categoria === 'HABILIDAD') {
                            // El Anillo suele ser cantidad muy baja (ej: 5), el chip es más alto (ej: 60)
                            if (mat.cantidad < 15) {
                                document.getElementById('mod-req-anillo').value = mat.material_id;
                                document.getElementById('mod-req-anillo-cant').value = mat.cantidad;
                            } else {
                                document.getElementById('mod-req-hab').value = mat.material_id;
                                document.getElementById('mod-req-hab-cant').value = mat.cantidad;
                            }
                        } 
                        else if (mat.categoria === 'ASCENSION') {
                            // Las monedas suelen ser miles/millones, la XP cientos, y la insignia unas decenas
                            if (mat.cantidad > 10000) {
                                document.getElementById('mod-req-monedas').value = mat.material_id;
                                document.getElementById('mod-req-monedas-cant').value = mat.cantidad;
                            } else if (mat.cantidad >= 100 && mat.cantidad <= 500) {
                                document.getElementById('mod-req-xp').value = mat.material_id;
                                document.getElementById('mod-req-xp-cant').value = mat.cantidad;
                            } else {
                                document.getElementById('mod-req-asc').value = mat.material_id;
                                document.getElementById('mod-req-asc-cant').value = mat.cantidad;
                            }
                        }
                    });
                }

                // Desbloqueamos las cajas para editar
                bloquearFormulario(false);
                msgDiv.textContent = ''; 
            } else {
                msgDiv.style.color = '#ff4a4a';
                msgDiv.textContent = 'Error: No se encontraron los datos del agente.';
            }
        } catch (error) {
            msgDiv.style.color = '#ff4a4a';
            msgDiv.textContent = 'Error de conexión al cargar los datos.';
            console.error(error);
        }
    });

    // -----------------------------------------------------------------
    // 4. ENVIAR LOS CAMBIOS A LA API (Método PUT)
    // -----------------------------------------------------------------
    if (formModificar) {
        formModificar.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const idModificar = document.getElementById('mod-id').value;
            if (!idModificar) return;

            msgDiv.style.color = 'white';
            msgDiv.textContent = 'Actualizando expediente en la base de datos...';

            const datosAgente = {
                // Info Base
                nombre: document.getElementById('mod-nombre').value.trim(),
                rareza: document.getElementById('mod-rareza').value,
                genero: document.getElementById('mod-genero').value.trim(),
                elemento: document.getElementById('mod-elemento').value.trim(),
                especialidad: document.getElementById('mod-especialidad').value.trim(),
                faccion: document.getElementById('mod-faccion').value.trim(),
                imagen: document.getElementById('mod-imagen').value.trim(),
                imagen_full: document.getElementById('mod-imagen-full').value.trim(),
                descripcion: document.getElementById('mod-desc').value.trim(),
                
                // Stats
                base_hp: document.getElementById('mod-hp').value,
                base_atk: document.getElementById('mod-atk').value,
                base_def: document.getElementById('mod-def').value,
                base_impacto: document.getElementById('mod-impacto').value,
                base_prob_crit: document.getElementById('mod-prob-crit').value.trim(),
                base_dano_crit: document.getElementById('mod-dano-crit').value.trim(),
                base_anomalia_maestria: document.getElementById('mod-anomalia-maestria').value,
                base_anomalia_tasa: document.getElementById('mod-anomalia-tasa').value,
                base_dano_bruto: document.getElementById('mod-dano-bruto').value,
                base_tasa_perforacion: document.getElementById('mod-tasa-perf').value.trim(),
                base_recarga_energia: document.getElementById('mod-recarga').value.trim(),
                base_adrenalina: document.getElementById('mod-adrenalina').value,

                // Arrays complejos
                build: {},
                cine_mental: [],
                habilidades: [],
                asc_requisitos: [],
                agente_vs_jefe: [],
                equipos: []
            };

            // BUILD
            datosAgente.build = {
                arma_top_1_id: document.getElementById('mod-b-arma-1').value || null,
                arma_top_2_id: document.getElementById('mod-b-arma-2').value || null,
                arma_top_3_id: document.getElementById('mod-b-arma-3').value || null,
                set_4_piezas_id: document.getElementById('mod-b-set-4').value || null,
                set_2_piezas_id: document.getElementById('mod-b-set-2').value || null,
                disco_4_main: document.getElementById('mod-b-disco-4').value.trim() || null,
                disco_5_main: document.getElementById('mod-b-disco-5').value.trim() || null,
                disco_6_main: document.getElementById('mod-b-disco-6').value.trim() || null,
                substats_prioridad: document.getElementById('mod-b-substats').value.trim() || null,
                meta_hp: document.getElementById('mod-b-meta-hp').value.trim() || null,
                meta_atk: document.getElementById('mod-b-meta-atk').value.trim() || null,
                meta_def: document.getElementById('mod-b-meta-def').value.trim() || null,
                meta_prob_crit: document.getElementById('mod-b-meta-prob').value.trim() || null,
                meta_dano_crit: document.getElementById('mod-b-meta-dano').value.trim() || null,
                meta_maestria_anomalia: document.getElementById('mod-b-meta-maestria').value.trim() || null,
                meta_tasa_anomalia: document.getElementById('mod-b-meta-tasa').value.trim() || null,
                meta_recarga: document.getElementById('mod-b-meta-recarga').value.trim() || null,
                meta_impacto: document.getElementById('mod-b-meta-impacto').value.trim() || null,
                meta_tasa_perforacion: document.getElementById('mod-b-meta-perf').value.trim() || null,
                meta_dano_bruto: document.getElementById('mod-b-meta-bruto').value.trim() || null,
                meta_adrenalina: document.getElementById('mod-b-meta-adren').value.trim() || null
            };

            // CINE MENTAL
            for (let i = 1; i <= 6; i++) {
                let nom = document.getElementById('mod-cine-nom-' + i)?.value.trim();
                let desc = document.getElementById('mod-cine-desc-' + i)?.value.trim();
                if (nom || desc) {
                    datosAgente.cine_mental.push({ numero: i, nombre: nom, descripcion: desc });
                }
            }

            // HABILIDADES
            const tiposHabilidades = ['Ataque Normal', 'Evasión', 'Técnica Especial', 'Definitiva', 'Pasiva Core', 'Asistencia'];
            tiposHabilidades.forEach((tipo, index) => {
                let num = index + 1;
                let nom = document.getElementById('mod-hab-nom-' + num)?.value.trim();
                let img = document.getElementById('mod-hab-img-' + num)?.value.trim();
                let desc = document.getElementById('mod-hab-desc-' + num)?.value.trim();
                
                if (nom || desc) {
                    datosAgente.habilidades.push({ nombre: nom || tipo, tipo: tipo, imagen_icono: img || null, descripcion: desc || '' });
                }
            });

            // REQUISITOS
            const addRequisito = (idInput, cantInput, categoria) => {
                let idVal = document.getElementById(idInput)?.value;
                let cantVal = document.getElementById(cantInput)?.value || 1; 
                if (idVal) {
                    datosAgente.asc_requisitos.push({ material_id: parseInt(idVal), cantidad: parseInt(cantVal), categoria: categoria, nivel_requerido: 60 });
                }
            };
            addRequisito('mod-req-asc', 'mod-req-asc-cant', 'ASCENSION');
            addRequisito('mod-req-hab', 'mod-req-hab-cant', 'HABILIDAD');
            addRequisito('mod-req-core', 'mod-req-core-cant', 'CORE');
            addRequisito('mod-req-xp', 'mod-req-xp-cant', 'ASCENSION');        
            addRequisito('mod-req-anillo', 'mod-req-anillo-cant', 'HABILIDAD'); 
            addRequisito('mod-req-monedas', 'mod-req-monedas-cant', 'ASCENSION'); 

            // JEFE DINÁMICO
            const bloquesJefes = document.querySelectorAll('#contenedor-dinamico-jefes .bloque-equipo');
            bloquesJefes.forEach(bloque => {
                let jefeId = bloque.querySelector('.avj-id').value;
                let jefeRazon = bloque.querySelector('.avj-razon').value.trim();
                if (jefeId) datosAgente.agente_vs_jefe.push({ jefe_id: parseInt(jefeId), razon_ventaja: jefeRazon });
            });

            // EQUIPO DINÁMICO
            const bloquesEquipos = document.querySelectorAll('#contenedor-dinamico-equipos .bloque-equipo');
            bloquesEquipos.forEach(bloque => {
                let eqTitulo = bloque.querySelector('.eq-titulo').value.trim();
                let eqComp1 = bloque.querySelector('.eq-comp1').value;
                let eqComp2 = bloque.querySelector('.eq-comp2').value;
                let eqBangboo = bloque.querySelector('.eq-bangboo').value;
                let eqDesc = bloque.querySelector('.eq-desc').value.trim();

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
                const respuesta = await fetch(BASE_URL_API + 'agentes/' + idModificar, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAgente)
                });
                
                const resultado = await respuesta.json();
                
                if (resultado.status === 'success') {
                    msgDiv.style.color = '#28a745';
                    msgDiv.textContent = '¡' + resultado.mensaje + '!';
                    
                    const opcionElegida = selectAgente.options[selectAgente.selectedIndex];
                    opcionElegida.textContent = datosAgente.nombre;
                } else {
                    msgDiv.style.color = '#ff4a4a';
                    msgDiv.textContent = 'Error: ' + resultado.mensaje;
                }
            } catch (error) {
                console.error(error);
                msgDiv.style.color = '#ff4a4a';
                msgDiv.textContent = 'Error de conexión al actualizar.';
            }
        });
    }

    // --- FUNCIÓN AUXILIAR PARA BLOQUEAR/DESBLOQUEAR EL FORMULARIO ---
    function bloquearFormulario(bloqueado) {
        // Añadimos .btn-dinamico a la lista de elementos a afectar
        const elementos = formModificar.querySelectorAll('input:not(#select-agente), select:not(#select-agente), textarea, .btn-dinamico');

        elementos.forEach(elemento => {
            if (bloqueado) {
                elemento.setAttribute('disabled', 'true');
            } else {
                elemento.removeAttribute('disabled');
            }
        });

        btnGuardar.disabled = bloqueado;
    }
});