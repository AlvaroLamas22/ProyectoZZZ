<?php
// Candado de seguridad
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
    <title>Modificar Personaje - Wiki ZZZ</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <video autoplay muted loop playsinline id="video-fondo">
          <source src="../video/fondo.webm" type="video/webm">
          
      </video>

    <header>
        <img src="../img/Logo.webp" alt="Logo Proxyhub">
        <h1>PROXYHUB - MODO ADMIN</h1>
        <img src="../img/fondo2.jpg" alt="Decoración">
    </header>

    <main>
        <h1>MODIFICAR AGENTE</h1>
        <h4>Selecciona un agente y actualiza sus datos base</h4>

        <div class="caja-boceto caja-admin-form admin-form-container">
            <h3 class="admin-form-titulo">ACTUALIZACIÓN DE FICHA</h3>
            
            <form id="form-modificar-agente" class="form-grid-admin">
                
                <h4 class="col-span-2 subtitulo-seccion-admin">Selección de Personaje</h4>
                
                <div class="col-span-2">
                    <label>Elige el Agente a modificar:</label>
                    <select id="select-agente" class="input-admin" style="border-color: #ffc107;" required>
                        <option value="">-- Cargando agentes... --</option>
                    </select>
                </div>

                <input type="hidden" id="mod-id">

                <h4 class="col-span-2 subtitulo-seccion-admin">Información General</h4>
                
                <div>
                    <label>Nombre:</label>
                    <input type="text" id="mod-nombre" class="input-admin" required disabled>
                </div>
                <div>
                    <label>Rareza:</label>
                    <select id="mod-rareza" class="input-admin" disabled>
                        <option value="S">S</option>
                        <option value="A">A</option>
                    </select>
                </div>
                <div>
                    <label>Género:</label>
                    <input type="text" id="mod-genero" class="input-admin" disabled>
                </div>
                <div>
                    <label>Elemento:</label>
                    <input type="text" id="mod-elemento" class="input-admin" required disabled>
                </div>
                <div>
                    <label>Especialidad:</label>
                    <input type="text" id="mod-especialidad" class="input-admin" required disabled>
                </div>
                <div>
                    <label>Facción:</label>
                    <input type="text" id="mod-faccion" class="input-admin" disabled>
                </div>

                <h4 class="col-span-2 subtitulo-seccion-admin">Multimedia y Lore</h4>
                
                <div>
                    <label>Ruta Imagen (Retrato):</label>
                    <input type="text" id="mod-imagen" class="input-admin" disabled>
                </div>
                <div>
                    <label>Ruta Imagen (Splash Full):</label>
                    <input type="text" id="mod-imagen-full" class="input-admin" disabled>
                </div>
                
                <div class="col-span-2">
                    <label>Descripción del personaje:</label>
                    <textarea id="mod-desc" class="input-admin textarea-admin" rows="3" disabled></textarea>
                </div>
                
                <h4 class="col-span-2 subtitulo-seccion-admin">Estadísticas Base</h4>
                
                <div>
                    <label>HP Base:</label>
                    <input type="number" id="mod-hp" class="input-admin" disabled>
                </div>
                <div>
                    <label>ATQ Base:</label>
                    <input type="number" id="mod-atk" class="input-admin" disabled>
                </div>
                <div>
                    <label>DEF Base:</label>
                    <input type="number" id="mod-def" class="input-admin" disabled>
                </div>
                <div>
                    <label>Impacto Base:</label>
                    <input type="number" id="mod-impacto" class="input-admin" disabled>
                </div>
                <div>
                    <label>Prob. Crítica:</label>
                    <input type="text" id="mod-prob-crit" class="input-admin" disabled>
                </div>
                <div>
                    <label>Daño Crítico:</label>
                    <input type="text" id="mod-dano-crit" class="input-admin" disabled>
                </div>
                <div>
                    <label>Maestría de Anomalía:</label>
                    <input type="number" id="mod-anomalia-maestria" class="input-admin" disabled>
                </div>
                <div>
                    <label>Tasa de Anomalía:</label>
                    <input type="number" id="mod-anomalia-tasa" class="input-admin" disabled>
                </div>
                <div>
                    <label>Daño Bruto:</label>
                    <input type="number" id="mod-dano-bruto" class="input-admin" disabled>
                </div>
                <div>
                    <label>Tasa de Perforación:</label>
                    <input type="text" id="mod-tasa-perf" class="input-admin" disabled>
                </div>
                <div>
                    <label>Recarga de Energía:</label>
                    <input type="text" id="mod-recarga" class="input-admin" disabled>
                </div>
                <div>
                    <label>Adrenalina Base:</label>
                    <input type="number" id="mod-adrenalina" class="input-admin" disabled>
                </div>

                <h4 class="col-span-2 subtitulo-seccion-admin">Build Recomendada</h4>
                    <div>
                        <label>Arma Top 1:</label>
                        <select id="mod-b-arma-1" class="input-admin" disabled>
                            <option value="">Selecciona un arma...</option>
                        </select>
                    </div>
                    <div>
                        <label>Arma Top 2:</label>
                        <select id="mod-b-arma-2" class="input-admin" disabled>
                            <option value="">Selecciona un arma...</option>
                        </select>
                    </div>
                    <div>
                        <label>Arma Top 3:</label>
                        <select id="mod-b-arma-3" class="input-admin" disabled>
                            <option value="">Selecciona un arma...</option>
                        </select>
                    </div>
                    <div>
                        <label>Set 4 Piezas:</label>
                        <select id="mod-b-set-4" class="input-admin" disabled>
                            <option value="">Selecciona un set...</option>
                        </select>
                    </div>
                    <div>
                        <label>Set 2 Piezas:</label>
                        <select id="mod-b-set-2" class="input-admin" disabled>
                            <option value="">Selecciona un set...</option>
                        </select>
                    </div>
                    <div>
                        <label>Prioridad Substats:</label>
                        <input type="text" id="mod-b-substats" class="input-admin" disabled>
                    </div>
                    
                    <div>
                        <label>Disco 4 (Main):</label>
                        <input type="text" id="mod-b-disco-4" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Disco 5 (Main):</label>
                        <input type="text" id="mod-b-disco-5" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Disco 6 (Main):</label>
                        <input type="text" id="mod-b-disco-6" class="input-admin" disabled>
                    </div>
                    
                    <div>
                        <label>Meta HP:</label>
                        <input type="text" id="mod-b-meta-hp" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta ATQ:</label>
                        <input type="text" id="mod-b-meta-atk" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta DEF:</label>
                        <input type="text" id="mod-b-meta-def" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Prob. CRIT:</label>
                        <input type="text" id="mod-b-meta-prob" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Daño CRIT:</label>
                        <input type="text" id="mod-b-meta-dano" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Maestría Anomalía:</label>
                        <input type="text" id="mod-b-meta-maestria" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Tasa Anomalía:</label>
                        <input type="text" id="mod-b-meta-tasa" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Recarga:</label>
                        <input type="text" id="mod-b-meta-recarga" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Impacto:</label>
                        <input type="text" id="mod-b-meta-impacto" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Perforación:</label>
                        <input type="text" id="mod-b-meta-perf" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Daño Bruto:</label>
                        <input type="text" id="mod-b-meta-bruto" class="input-admin" disabled>
                    </div>
                    <div>
                        <label>Meta Adrenalina:</label>
                        <input type="text" id="mod-b-meta-adren" class="input-admin" disabled>
                    </div>

                <h4 class="col-span-2 subtitulo-seccion-admin">Habilidades Principales</h4>
                    <?php 
                        $tipos_hab = ['Ataque Normal', 'Evasión', 'Técnica Especial', 'Definitiva', 'Pasiva Core', 'Asistencia'];
                        foreach ($tipos_hab as $index => $tipo): 
                            $num = $index + 1;
                    ?>
                        <div class="col-span-2">
                            <label><?php echo $tipo; ?>:</label>
                            <div style="display: flex; gap: 10px; margin-bottom: 5px;">
                                <input type="text" id="mod-hab-nom-<?php echo $num; ?>" class="input-admin" style="width: 50%;" placeholder="Nombre..." disabled>
                                <input type="text" id="mod-hab-img-<?php echo $num; ?>" class="input-admin" style="width: 50%;" placeholder="Ruta Icono..." disabled>
                            </div>
                            <textarea id="mod-hab-desc-<?php echo $num; ?>" class="input-admin textarea-admin" rows="1" placeholder="Descripción de la habilidad..." disabled></textarea>
                        </div>
                    <?php endforeach; ?>

                <h4 class="col-span-2 subtitulo-seccion-admin">Cine Mental (6 Niveles)</h4>
                    <?php for($i=1; $i<=6; $i++): ?>
                    <div class="col-span-2">
                        <label>Nivel <?php echo $i; ?> (Nombre | Descripción):</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="mod-cine-nom-<?php echo $i; ?>" class="input-admin" style="width: 30%;" placeholder="Nombre M<?php echo $i; ?>" disabled>
                            <input type="text" id="mod-cine-desc-<?php echo $i; ?>" class="input-admin" style="width: 70%;" placeholder="Descripción..." disabled>
                        </div>
                    </div>
                    <?php endfor; ?>

                <h4 class="col-span-2 subtitulo-seccion-admin">Materiales Principales</h4>
                    <div>
                        <label>Insignia Ascensión:</label>
                        <select id="mod-req-asc" class="input-admin" disabled>
                            <option value="">Selecciona insignia...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Insignias:</label>
                        <input type="number" id="mod-req-asc-cant" class="input-admin" disabled>
                    </div>

                    <div>
                        <label>Chip Habilidad:</label>
                        <select id="mod-req-hab" class="input-admin" disabled>
                            <option value="">Selecciona chip...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Chips:</label>
                        <input type="number" id="mod-req-hab-cant" class="input-admin" disabled>
                    </div>
                    
                    <div>
                        <label>Core Jefe:</label>
                        <select id="mod-req-core" class="input-admin" disabled>
                            <option value="">Selecciona core...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Cores:</label>
                        <input type="number" id="mod-req-core-cant" class="input-admin" disabled>
                    </div>

                    <div>
                        <label>Material XP:</label>
                        <select id="mod-req-xp" class="input-admin" disabled>
                            <option value="">Selecciona XP...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad XP:</label>
                        <input type="number" id="mod-req-xp-cant" class="input-admin" disabled>
                    </div>

                    <div>
                        <label>Pase Hámster (Anillo):</label>
                        <select id="mod-req-anillo" class="input-admin" disabled>
                            <option value="">Selecciona anillo...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Anillos:</label>
                        <input type="number" id="mod-req-anillo-cant" class="input-admin" disabled>
                    </div>

                    <div>
                        <label>Monedas (Dennys):</label>
                        <select id="mod-req-monedas" class="input-admin" disabled>
                            <option value="">Selecciona moneda...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Monedas:</label>
                        <input type="number" id="mod-req-monedas-cant" class="input-admin" disabled>
                    </div>

                <!-- Cambiar en casa -->
                <h4 class="col-span-2 subtitulo-seccion-admin" style="display:flex; justify-content:space-between; align-items:center;">
                    Ventajas contra Jefes
                    <button type="button" id="btn-add-jefe" class="btn-admin btn-pequeno btn-dinamico" style="width: auto; padding: 5px 15px; font-size: 0.9rem;" disabled>
                        + Añadir Jefe
                    </button>
                </h4>
                <div id="contenedor-dinamico-jefes" class="col-span-2"></div>

                <h4 class="col-span-2 subtitulo-seccion-admin" style="display:flex; justify-content:space-between; align-items:center;">
                    Equipos Recomendados
                    <button type="button" id="btn-add-equipo" class="btn-admin btn-pequeno btn-dinamico" style="width: auto; padding: 5px 15px; font-size: 0.9rem;" disabled>
                        + Añadir Equipo
                    </button>
                </h4>
                <div id="contenedor-dinamico-equipos" class="col-span-2"></div>

                <div id="msg-form-mod" class="col-span-2 msg-form-admin"></div>

                <div class="col-span-2 admin-btn-group">
                    <button type="submit" id="btn-guardar-mod" class="btn-admin btn-modificar btn-pequeno" disabled>Guardar Cambios</button>
                    <button type="button" id="btn-volver-mod" class="btn-admin btn-borrar btn-pequeno">Volver al Panel</button>
                </div>
            </form>
        </div>
    </main>

    <footer>
        <p>&copy; 2026 - Sección de Administración Privada</p>
    </footer>

    <script src="modificar.js"></script>
</body>
</html>