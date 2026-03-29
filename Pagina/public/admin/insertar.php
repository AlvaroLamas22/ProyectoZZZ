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
    <title>Añadir Personaje - Wiki ZZZ</title>
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
        <h1>AÑADIR NUEVO AGENTE</h1>
        <h4>Rellena los datos base del personaje</h4>

        <div class="caja-boceto caja-admin-form admin-form-container">
            <h3 class="admin-form-titulo">FICHA DEL AGENTE</h3>
            
            <form id="form-nuevo-agente" class="form-grid-admin">
                
                <h4 class="col-span-2 subtitulo-seccion-admin" >Información General</h4>
                
                    <div>
                        <label>Nombre:</label>
                        <input type="text" id="add-nombre" class="input-admin" required>
                    </div>
                    <div>
                        <label>Rareza:</label>
                        <select id="add-rareza" class="input-admin">
                            <option value="S">S</option>
                            <option value="A">A</option>
                        </select>
                    </div>
                    <div>
                        <label>Género:</label>
                        <input type="text" id="add-genero" class="input-admin" placeholder="Ej: Femenino, Masculino">
                    </div>
                    <div>
                        <label>Elemento:</label>
                        <input type="text" id="add-elemento" class="input-admin" required>
                    </div>
                    <div>
                        <label>Especialidad:</label>
                        <input type="text" id="add-especialidad" class="input-admin" required>
                    </div>
                    <div>
                        <label>Facción:</label>
                        <input type="text" id="add-faccion" class="input-admin">
                    </div>

                    <h4 class="col-span-2 subtitulo-seccion-admin" >Multimedia y Lore</h4>
                    
                    <div>
                        <label>Ruta Imagen (Retrato):</label>
                        <input type="text" id="add-imagen" class="input-admin" placeholder="assets/img/agentes/...webp">
                    </div>
                    <div>
                        <label>Ruta Imagen (Splash Full):</label>
                        <input type="text" id="add-imagen-full" class="input-admin" placeholder="assets/img/agentes/splash/...webp">
                    </div>
                    
                    <div class="col-span-2">
                        <label>Descripción del personaje:</label>
                        <textarea id="add-desc" class="input-admin textarea-admin" rows="3"></textarea>
                    </div>
                
                <h4 class="col-span-2 subtitulo-seccion-admin">Estadísticas Base</h4>
                
                    <div>
                        <label>HP Base:</label>
                        <input type="number" id="add-hp" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>ATQ Base:</label>
                        <input type="number" id="add-atk" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>DEF Base:</label>
                        <input type="number" id="add-def" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>Impacto Base:</label>
                        <input type="number" id="add-impacto" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>Prob. Crítica:</label>
                        <input type="text" id="add-prob-crit" class="input-admin" value="5%">
                    </div>
                    <div>
                        <label>Daño Crítico:</label>
                        <input type="text" id="add-dano-crit" class="input-admin" value="50%">
                    </div>
                    <div>
                        <label>Maestría de Anomalía:</label>
                        <input type="number" id="add-anomalia-maestria" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>Tasa de Anomalía:</label>
                        <input type="number" id="add-anomalia-tasa" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>Daño Bruto:</label>
                        <input type="number" id="add-dano-bruto" class="input-admin" value="0">
                    </div>
                    <div>
                        <label>Tasa de Perforación:</label>
                        <input type="text" id="add-tasa-perf" class="input-admin" value="0%">
                    </div>
                    <div>
                        <label>Recarga de Energía:</label>
                        <input type="text" id="add-recarga" class="input-admin" value="1.2">
                    </div>

                    <div>
                        <label>Adrenalina Base:</label>
                        <input type="number" id="add-adrenalina" class="input-admin" value="0">
                    </div>

                <h4 class="col-span-2 subtitulo-seccion-admin">Build Recomendada</h4>
                <div>
                    <label>Arma Top 1:</label>
                    <select id="b-arma-1" class="input-admin">
                        <option value="">Selecciona un arma...</option>
                    </select>
                </div>
                <div>
                    <label>Arma Top 2:</label>
                    <select id="b-arma-2" class="input-admin">
                        <option value="">Selecciona un arma...</option>
                    </select>
                </div>
                <div>
                    <label>Arma Top 3:</label>
                    <select id="b-arma-3" class="input-admin">
                        <option value="">Selecciona un arma...</option>
                    </select>
                </div>
                <div>
                    <label>Set 4 Piezas:</label>
                    <select id="b-set-4" class="input-admin">
                        <option value="">Selecciona un set...</option>
                    </select>
                </div>
                <div>
                    <label>Set 2 Piezas:</label>
                    <select id="b-set-2" class="input-admin">
                        <option value="">Selecciona un set...</option>
                    </select>
                </div>
                <div>
                    <label>Prioridad Substats:</label>
                    <input type="text" id="b-substats" class="input-admin" placeholder="Ej: Prob > Daño > ATQ">
                </div>
                
                <div>
                    <label>Disco 4 (Main):</label>
                    <input type="text" id="b-disco-4" class="input-admin">
                </div>
                <div>
                    <label>Disco 5 (Main):</label>
                    <input type="text" id="b-disco-5" class="input-admin">
                </div>
                <div>
                    <label>Disco 6 (Main):</label>
                    <input type="text" id="b-disco-6" class="input-admin">
                </div>
                
                <div>
                    <label>Meta HP:</label>
                    <input type="text" id="b-meta-hp" class="input-admin">
                </div>
                <div>
                    <label>Meta ATQ:</label>
                    <input type="text" id="b-meta-atk" class="input-admin">
                </div>
                <div>
                    <label>Meta DEF:</label>
                    <input type="text" id="b-meta-def" class="input-admin">
                </div>
                <div>
                    <label>Meta Prob. CRIT:</label>
                    <input type="text" id="b-meta-prob" class="input-admin">
                </div>
                <div>
                    <label>Meta Daño CRIT:</label>
                    <input type="text" id="b-meta-dano" class="input-admin">
                </div>
                <div>
                    <label>Meta Maestría Anomalía:</label>
                    <input type="text" id="b-meta-maestria" class="input-admin">
                </div>
                <div>
                    <label>Meta Tasa Anomalía:</label>
                    <input type="text" id="b-meta-tasa" class="input-admin">
                </div>
                <div>
                    <label>Meta Recarga:</label>
                    <input type="text" id="b-meta-recarga" class="input-admin">
                </div>
                <div>
                    <label>Meta Impacto:</label>
                    <input type="text" id="b-meta-impacto" class="input-admin">
                </div>
                <div>
                    <label>Meta Perforación:</label>
                    <input type="text" id="b-meta-perf" class="input-admin">
                </div>
                <div>
                    <label>Meta Daño Bruto:</label>
                    <input type="text" id="b-meta-bruto" class="input-admin">
                </div>
                <div>
                    <label>Meta Adrenalina:</label>
                    <input type="text" id="b-meta-adren" class="input-admin">
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
                                <input type="text" id="hab-nom-<?php echo $num; ?>" class="input-admin" style="width: 50%;" placeholder="Nombre (Ej: Turbo Voltaje)">
                                <input type="text" id="hab-img-<?php echo $num; ?>" class="input-admin" style="width: 50%;" placeholder="Ruta Icono (assets/img/ui/...)">
                            </div>
                            <textarea id="hab-desc-<?php echo $num; ?>" class="input-admin textarea-admin" rows="1" placeholder="Descripción de la habilidad..."></textarea>
                        </div>
                    <?php endforeach; ?>

                <h4 class="col-span-2 subtitulo-seccion-admin">Cine Mental (6 Niveles)</h4>

                    <?php for($i=1; $i<=6; $i++): ?>
                    <div class="col-span-2">
                        <label>Nivel <?php echo $i; ?> (Nombre | Descripción):</label>
                        
                        <div style="display: flex; gap: 10px;">

                            <input type="text" id="cine-nom-<?php echo $i; ?>" class="input-admin" style="width: 30%;" placeholder="Nombre M<?php echo $i; ?>" 
                                <?php 
                                    if($i==3) echo 'value="Nivel de Habilidades +2"'; 
                                    if($i==5) echo 'value="Nivel EX +2"'; 
                                ?>>
                            <input type="text" id="cine-desc-<?php echo $i; ?>" class="input-admin" style="width: 70%;" placeholder="Descripción..." 
                                <?php 
                                    if($i==3) echo 'value="Nivel de Ataque Normal, Evasión, Técnica Especial y Cadena +2."'; 
                                    if($i==5) echo 'value="Nivel de Técnica Especial EX y Definitiva +2."'; 
                                ?>>
                        </div>
                    </div>
                    <?php endfor; ?>

                <h4 class="col-span-2 subtitulo-seccion-admin">Materiales Principales</h4>
                    <div>
                        <label>Insignia Ascensión:</label>
                        <select id="req-asc" class="input-admin">
                            <option value="">Selecciona insignia...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Insignias:</label>
                        <input type="number" id="req-asc-cant" class="input-admin" value="30">
                    </div>

                    <div>
                        <label>Chip Habilidad:</label>
                        <select id="req-hab" class="input-admin">
                            <option value="">Selecciona chip...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Chips:</label>
                        <input type="number" id="req-hab-cant" class="input-admin" value="60">
                    </div>
                    
                    <div>
                        <label>Core Jefe:</label>
                        <select id="req-core" class="input-admin">
                            <option value="">Selecciona core...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Cores:</label>
                        <input type="number" id="req-core-cant" class="input-admin" value="9">
                    </div>

                    <div>
                        <label>Material XP:</label>
                        <select id="req-xp" class="input-admin">
                            <option value="">Selecciona XP...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad XP:</label>
                        <input type="number" id="req-xp-cant" class="input-admin" value="150">
                    </div>

                    <div>
                        <label>Pase Hámster (Anillo):</label>
                        <select id="req-anillo" class="input-admin">
                            <option value="">Selecciona anillo...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Anillos:</label>
                        <input type="number" id="req-anillo-cant" class="input-admin" value="5">
                    </div>

                    <div>
                        <label>Monedas (Dennys):</label>
                        <select id="req-monedas" class="input-admin">
                            <option value="">Selecciona moneda...</option>
                        </select>
                    </div>
                    <div>
                        <label>Cantidad Monedas:</label>
                        <input type="number" id="req-monedas-cant" class="input-admin" value="2500000">
                    </div>

                <!-- Comprobar en casa -->
                <h4 class="col-span-2 subtitulo-seccion-admin" style="display:flex; justify-content:space-between; align-items:center;">
                    Ventajas contra Jefes
                    <button type="button" id="btn-add-jefe" class="btn-admin btn-pequeno" style="width: auto; padding: 5px 15px; font-size: 0.9rem;">
                        + Añadir Jefe
                    </button>
                </h4>
                
                <div id="contenedor-dinamico-jefes" class="col-span-2"></div>

                <!-- Comprobar en casa -->
                <h4 class="col-span-2 subtitulo-seccion-admin">Equipo Recomendado
                    <button type="button" id="btn-add-equipo" class="btn-admin btn-pequeno" style="width: auto; padding: 5px 15px; font-size: 0.9rem;">
                        + Añadir Equipo
                    </button>
                </h4>
                <div id="contenedor-dinamico-equipos" class="col-span-2"></div> 

                <div id="msg-form" class="col-span-2 msg-form-admin"></div>

                <div class="col-span-2 admin-btn-group">
                    <button type="submit" class="btn-admin btn-añadir btn-pequeno">Guardar Agente</button>
                    <button type="button" id="btn-volver" class="btn-admin btn-modificar btn-pequeno">Volver al Panel</button>
                </div>
            </form>
        </div>
    </main>

    <footer>
        <p>&copy; 2026 - Sección de Administración Privada</p>
    </footer>

    <script src="insertar.js"></script>
</body>
</html>