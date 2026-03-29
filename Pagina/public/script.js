// -------------------------- CONSTANTE GLOBAL --------------------------
const BASE_URL_API = "http://localhost/ProyectoZZZ/ApiRest/"

// -------------------------- EVENTO PARA CARGAR LOS DATOS --------------------------
document.addEventListener('DOMContentLoaded', async () => {

    await cargarAgentes();
    configurarBuscador();

    const btnToggle = document.getElementById('btn-toggle-nav');
    const navAgentes = document.getElementById('nav-agentes');

    btnToggle.addEventListener('click', () => {
        navAgentes.classList.toggle('abierto');
        btnToggle.classList.toggle('movido');

        if (navAgentes.classList.contains('abierto')) {
            btnToggle.innerHTML = 'CERRAR ▸';
        } else {
            btnToggle.innerHTML = 'AGENTES ◂';
        }
    });
});

// -------------------------- FUNCION PARA FILTRAR LOS AGENTES EN TIEMPO REAL --------------------------

function configurarBuscador() {
    const inputBuscador = document.getElementById('input-buscador');
    let timeoutDeBusqueda; // Guardamos el temporizador

    inputBuscador.addEventListener('input', (evento) => {
        clearTimeout(timeoutDeBusqueda); // Si el usuario sigue tecleando, reiniciamos el reloj

        ctimeoutDeBusqueda = setTimeout(() => {
            const textoBusqueda = evento.target.value.toLowerCase();
            const tarjetas = document.querySelectorAll('.tarjeta-agente');

            tarjetas.forEach(tarjeta => {
                const nombreAgente = tarjeta.querySelector('.capa-nombre').textContent.toLowerCase();
                // Forma resumida (operador ternario) para ocultar/mostrar
                tarjeta.style.display = nombreAgente.includes(textoBusqueda) ? '' : 'none';
            });
        }, 300); // 300ms es el estándar de la industria
    });
}

// -------------------------- FUNCIONES PARA LLAMAR A LA API --------------------------

// Función ASÍNCRONA para obtener y pintar los agentes
async function cargarAgentes() {
    const grid = document.getElementById('grid-agentes');
    grid.innerHTML = '<p style="color: #666; font-style: italic;">Cargando red...</p>';

    try {
        const respuesta = await fetch(BASE_URL_API + 'agentes');
        const agentes = await respuesta.json();

        grid.innerHTML = '';

        const listaAgentes = agentes.data ? agentes.data : agentes;

        listaAgentes.forEach(agente => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-agente';
            tarjeta.dataset.id = agente.id;

            const img = document.createElement('img');
            img.className = 'capa-personaje';
            img.src = BASE_URL_API + agente.imagen + "?v=" + new Date().getTime(); 
            img.alt = agente.nombre;

            // Imagen si no hay foto en la base de datos
            img.onerror = () => {
                img.onerror = null; 
                img.src = 'img/sin-foto.webp';
            };

            const capaInfo = document.createElement('div');
            capaInfo.className = 'capa-info';
            
            const claseRareza = agente.rareza ? agente.rareza.toLowerCase() : 'a';

            capaInfo.innerHTML = `
                <div class="datos-extra">
                    <span class="elemento">${agente.elemento}</span>
                    <span class="rareza rareza-${claseRareza}">Rango ${agente.rareza}</span>
                </div>
                <span class="capa-nombre">${agente.nombre}</span>
            `;

            tarjeta.appendChild(img);
            tarjeta.appendChild(capaInfo);

            grid.appendChild(tarjeta);
            
        });

        // Un solo evento para todo el Grid
        grid.addEventListener('click', (evento) => {
            // Busca si hicimos clic dentro de una tarjeta
            const tarjetaClicada = evento.target.closest('.tarjeta-agente');

            if (tarjetaClicada) {
                const idAgente = tarjetaClicada.dataset.id;
                cargarDetalleAgente(idAgente);
            }
        });

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="color: red;">Error al cargar los agentes.</p>';
    }
}

// Función asíncrona para cargar los detalles de los personajes
async function cargarDetalleAgente(id) {

    // Coge el cuerpo de la página
    const main = document.querySelector('main');

    // Para pintar un mensaje mientras cargan los datos
    main.innerHTML = `<p class="msg-cargando">Cargando base de datos...</p>`;

    try {
        const res = await fetch(BASE_URL_API + 'agentes/' + id);
        const d = await res.json();

        const info       = d.info;
        const build      = d.build;
        const habs       = d.habilidades;
        const equipos    = d.equipos;
        const mats       = d.materiales;
        const ventajas   = d.ventajas;
        const cineMental = d.discos_mentales;

        // Pintamos los datos en el main llamando a las funciones para pintar
        main.innerHTML = `
            <div class="perfil-boceto">
                <h1 class="titulo-personaje">${info.nombre || 'Nombre'}</h1>

                <div class="grid-boceto">
                    
                    <div class="caja-boceto caja-doble">
                        <h3>Expediente del Agente</h3>
                        <div class="contenido-caja layout-descripcion">
                            
                            <div class="col-foto">
                                <img src="${BASE_URL_API}${info.imagen_full || info.imagen}" alt="${info.nombre}" class="foto-descripcion">
                            </div>
                            
                            <div class="col-texto">
                                <p>${info.descripcion || 'Sin descripción.'}</p>
                                <hr class="linea-separadora">
                                <p><strong>Elemento:</strong> <span class="texto-elemento">${info.elemento || '---'}</span></p>
                                <p><strong>Rango:</strong> ${info.rareza || '---'}</p>
                                <p><strong>Facción:</strong> ${info.faccion || '---'}</p>
                            </div>
                            
                        </div>
                    </div>

                    <div class="caja-boceto">
                        <h3>Stats base (Nvl Max)</h3>
                        <div class="contenido-caja">${htmlStatsBase(info)}</div>
                    </div>

                    <div class="caja-boceto">
                        <h3>Materiales de Ascensión</h3>
                        <div class="contenido-caja">${htmlMateriales(mats)}</div>
                    </div>

                    <div class="caja-boceto caja-doble">
                        <h3>Discos Recomendados y Stats a buscar</h3>
                        <div class="contenido-caja layout-discos">
                            <div class="col-build">${htmlBuildDiscos(build)}</div>
                            <div class="col-stats">
                                <p class="titulo-stats-obj">Stats Objetivo:</p>
                                ${htmlStatsDiscos(build, info)}
                            </div>
                        </div>
                    </div>

                    <div class="caja-boceto">
                        <h3>Habilidades</h3>
                        <div class="contenido-caja">${htmlHabilidades(habs)}</div>
                    </div>

                    <div class="caja-boceto">
                        <h3>W-Engines (Armas)</h3>
                        <div class="contenido-caja">${htmlArmas(build)}</div>
                    </div>

                    <div class="caja-boceto caja-doble">
                        <h3>Cine Mental</h3>
                        <div class="contenido-caja">${htmlCineMental(cineMental)}</div>
                    </div>

                    <div class="caja-boceto">
                        <h3>Ventajas vs Jefes</h3>
                        <div class="contenido-caja">
                            ${htmlVentajas(ventajas)}
                        </div>
                    </div>

                    <div class="caja-boceto">
                        <h3>Equipos Recomendados</h3>
                        <div class="contenido-caja">
                            ${htmlEquipos(equipos)}
                        </div>
                    </div>

                </div>
            </div>
        `;

        // Si carga un nuevo personajes y el usuario había hecho scroll hacia abajo lo vuelve a poner al principio
        main.scrollTop = 0;

    } catch (err) {
        console.error(err);
        main.innerHTML = `<p class="msg-error">Error: ${err.message}</p>`;
    }
}

// -------------------------- FUNCIONES PARA PINTAR LA INFORMACIÓN DE LOS PERSONAJES --------------------------

// Función para mostrar las estadísticas de los personajes
function htmlStatsBase(info) {

    // Estadísticas condicionales según la especialidad
    let statsCondicionales = [];
    
    if (info.especialidad && info.especialidad.toLowerCase() === 'ruptura') {
        statsCondicionales = [
            ['Daño Bruto', info.base_dano_bruto],
            ['Adrenalina', info.base_adrenalina]
        ];
    } else {
        statsCondicionales = [
            ['Rec. Energía', info.base_recarga_energia],
            ['Perforación', info.base_tasa_perforacion]
        ];
    }

    // Filter para filtar los datos q esten nulos o vacios en la tabla
    const campos = [
        ['PV',              info.base_hp],
        ['ATQ',             info.base_atk ],
        ['DEF',             info.base_def ],
        ['Impacto',         info.base_impacto ],
        ['Prob. Crit',      info.base_prob_crit ],
        ['Daño Crit',       info.base_dano_crit ],
        ['Maestría Anom.',  info.base_anomalia_maestria ],
        ['Tasa Anom.',      info.base_anomalia_tasa],
        ...statsCondicionales // Usa los tres puntos para que el filter y el map no den fallo por tener un array dentro de otro (Como si desempaquetase el array)
    ].filter(([, v]) => v != null && v !== '');

    // Si el array esta vacio devuelve esta información
    if (!campos.length) return `<p class="no-data">Sin stats registradas.</p>`;
    
    // Crea una tabla mediante un map del array
    return `<table class="stats-tbl">${
        campos.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')
    }</table>`;
}

// Función para mostrar los materiales de los personajes
function htmlMateriales(mats) {

    // Si no hay valor devuelve esta información
    if (!mats.length) return `<p class="no-data">Sin materiales.</p>`;

    // Devuelve los datos pintados de los materiales
    return `<div class="contenedor-materiales">${
        mats.map(m => `
            <div class="item-material">
                <img src="${BASE_URL_API + m.imagen}" class="img-material" alt="${m.nombre}">
                <div class="cantidad-material">x${m.cantidad}</div>
            </div>
        `).join('')
    }</div>`;
}

// Función para pintar los discos de los personajes
function htmlBuildDiscos(b) {

    // Si no hay datos de los discos devuelva esta información
    if (!b || (!b.set4_nombre && !b.set2_nombre)) return `<p class="no-data">Sin build de discos.</p>`;

    // Contenedor principal
    let h = '<div class="contenedor-discos">';
    
    // Si tiene 4 discos pinta la información
    if (b.set4_nombre) {
        h += `<div class="item-disco">
                <img src="${BASE_URL_API + b.set4_imagen}" class="img-disco" onerror="this.onerror=null; this.src='img/sin-disco.webp';" alt="Set 4">
                <div class="info-disco">
                    <strong class="label-disco">4P:</strong> ${b.set4_nombre}
                    <div class="desc-disco"><strong>2P:</strong> ${b.set4_efecto_2_piezas || ''}</div>
                    <div class="desc-disco">${b.efecto_4_piezas || ''}</div>
                </div>
              </div>`;
    }

    // Si tiene 2 discos pinta la información
    if (b.set2_nombre) {
        h += `<div class="item-disco">
                <img src="${BASE_URL_API + b.set2_imagen}" class="img-disco" onerror="this.onerror=null; this.src='img/sin-disco.webp';" alt="Set 2">
                <div class="info-disco">
                    <strong class="label-disco">2P:</strong> ${b.set2_nombre}
                    <div class="desc-disco">${b.efecto_2_piezas || ''}</div>
                </div>
              </div>`;
    }
    h += '</div>';

    return h;
}

// Función para pintar las stats de los discos y del personaje a llegar
function htmlStatsDiscos(b, info) {

    if (!b) return `<p class="no-data">Sin datos.</p>`;

    // Estadísticas condicionales según la especialidad
    let statsCondicionales = [];
    
    if (info.especialidad && info.especialidad.toLowerCase() === 'ruptura') {
        statsCondicionales = [
            ['Daño Bruto', b.meta_dano_bruto],
            ['Adrenalina', b.meta_adrenalina]
        ];
    } else {
        statsCondicionales = [
            ['Rec. Energía', b.meta_recarga],
            ['Perforación', b.meta_tasa_perforacion]
        ];
    }
    
    // Lo que hay que buscar en los discos
    const filasDiscos = [
        ['Disco 4 (Main)',   b.disco_4_main],
        ['Disco 5 (Main)',   b.disco_5_main],
        ['Disco 6 (Main)',   b.disco_6_main],
        ['Substats',         b.substats_prioridad]
    ].filter(([, v]) => v != null && v !== '0' && v !== '0%');

    // Los números finales recomendados (Meta)
    const filasMeta = [
        ['Meta PV',          b.meta_hp ],
        ['Meta ATQ',         b.meta_atk ],
        ['Meta DEF',         b.meta_def ],
        ['Meta Impacto',     b.meta_impacto],
        ['Meta Prob. Crit',  b.meta_prob_crit ],
        ['Meta Daño Crit',   b.meta_dano_crit ],
        ['Meta Maestría',    b.meta_maestria_anomalia ],
        ['Meta Tasa Anom.',  b.meta_tasa_anomalia ], 
        ...statsCondicionales
    ].filter(([, v]) => v != null && v !== '');

    let html = '';
    
    // Dibuja la tabla de los discos (usando clases limpias)
    if (filasDiscos.length > 0) {
        html += `<table class="stats-tbl tabla-discos">${
            filasDiscos.map(([k, v]) => `<tr><td>${k}</td><td class="val-disco">${v}</td></tr>`).join('')
        }</table>`;
    }

    // Dibuja la tabla de las estadísticas a llegar (usando clases limpias)
    if (filasMeta.length > 0) {
        html += `<p class="titulo-endgame">Valores finales (Endgame):</p>
                 <table class="stats-tbl">${
            filasMeta.map(([k, v]) => `<tr><td>${k}</td><td class="val-meta">${v}</td></tr>`).join('')
        }</table>`;
    }

    if (html === '') return `<p class="no-data">Sin stats objetivo registradas.</p>`;

    return html;
}

// Función para pintar las armas
function htmlArmas(b) {

    // Comprueba si entran datos
    if (!b) return `<p class="no-data">Sin armas recomendadas.</p>`;

    const lista = [
        { nombre: b.arma1_nombre, img: b.arma1_imagen, rank: '1º' },
        { nombre: b.arma2_nombre, img: b.arma2_imagen, rank: '2º' },
        { nombre: b.arma3_nombre, img: b.arma3_imagen, rank: '3º' }
    ].filter(a => a.nombre);

    // Comprueba si hay o no un arma en la bd
    if (!lista.length) return `<p class="no-data">Sin W-Engines.</p>`;
    
    // Pinta la información en pantalla usando clases limpias
    return `<div class="contenedor-armas">${
        lista.map(a => `
        <div class="item-arma">
            <div class="rank-arma">${a.rank}</div>
            <img src="${BASE_URL_API + a.img}" class="img-arma" onerror="this.style.display='none'" alt="${a.nombre}">
            <span class="nombre-arma">${a.nombre}</span>
        </div>`).join('')
    }</div>`;
}

// Función para pintar las habilidades
function htmlHabilidades(habs) {

    // Comprueba si hay información sobre las habilidades
    if (!habs.length) return `<p class="no-data">Sin habilidades.</p>`;

    // Pinta los datos en pantalla
    return `<ul style="padding-left: 20px; margin: 0;">${habs.map(h => `
        <li><strong>${h.tipo || h.nombre}:</strong> ${h.descripcion || '...'}</li>
    `).join('')}</ul>`;
}

// Función para pintar el Cine Mental (Copias de personajes)
function htmlCineMental(cms) {

    // Comprueba si hay información sobre el cine mental
    if (!cms.length) return `<p class="no-data">Sin datos de Cine Mental.</p>`;

    // Pinta los datos en pantalla usando su clase
    return `<ul class="lista-cine-mental">${cms.map(c => `
        <li><strong class="num-cine">Nº${c.numero}:</strong> <span class="desc-cine">${c.descripcion || ''}</span></li>
    `).join('')}</ul>`;
}

// Función para pintar los equipos recomendados
function htmlEquipos(equipos) {

    // Comprueba si hay información de los equipos
    if (!equipos.length) return `<p class="no-data">Sin equipos.</p>`;

    // Envuelve todo en un contenedor y pinta la fila de avatares
    return `<div class="contenedor-equipos">${equipos.map((eq, i) => `
        <div class="item-equipo">
            <strong class="titulo-equipo">${eq.titulo_equipo || 'Equipo ' + (i+1)}</strong>
            
            <div class="fila-avatares">
                
                ${eq.comp1_nombre ? `
                <div class="caja-avatar">
                    <img src="${BASE_URL_API + eq.comp1_imagen}" class="img-avatar" onerror="this.onerror=null; this.src='img/sin-disco.webp';" alt="${eq.comp1_nombre}">
                    <span class="nombre-avatar">${eq.comp1_nombre}</span>
                </div>` : ''}
                
                ${eq.comp2_nombre ? `
                <div class="caja-avatar">
                    <img src="${BASE_URL_API + eq.comp2_imagen}" class="img-avatar" onerror="this.onerror=null; this.src='img/sin-disco.webp';" alt="${eq.comp2_nombre}">
                    <span class="nombre-avatar">${eq.comp2_nombre}</span>
                </div>` : ''}

                ${eq.bangboo_nombre ? `
                <div class="caja-avatar avatar-bangboo">
                    <img src="${BASE_URL_API + eq.bangboo_imagen}" class="img-avatar img-bangboo" onerror="this.onerror=null; this.src='img/sin-disco.webp';" alt="${eq.bangboo_nombre}">
                    <span class="nombre-avatar bangboo-texto">${eq.bangboo_nombre}</span>
                </div>` : ''}

            </div>
        </div>
    `).join('')}</div>`;
}

// Función para pintar las ventajas con los bosses
function htmlVentajas(ventajas) {

    // Comprueba si hay información sobre las ventajas
    if (!ventajas.length) return `<p class="no-data">Sin ventajas.</p>`;

    return `<div class="contenedor-ventajas">${ventajas.map(v => `
        <div class="item-ventaja">
            <img src="${BASE_URL_API + v.imagen}" class="img-jefe" onerror="this.style.display='none'" alt="${v.nombre}">
            <div class="info-jefe">
                <strong class="nombre-jefe">${v.nombre}</strong>: 
                <span class="razon-jefe">${v.razon_ventaja || ''}</span>
            </div>
        </div>
    `).join('')}</div>`;
}

// -------------------------- EVENTO PARA ENTRAR EN MODO ADMINISTRADOR --------------------------
document.addEventListener('keydown', (evento) => {
    // Comprueba si el usuario está pulsando Ctrl + Alt + la tecla A
    if (evento.ctrlKey && evento.altKey && evento.code === 'KeyA') {
        evento.preventDefault();
        window.location.href = 'admin/login.html'; 
    }
});