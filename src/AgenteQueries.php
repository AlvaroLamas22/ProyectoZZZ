<?php

    class AgenteQueries {
        // --- CONSULTAS SIMPLES (SELECTS DE LISTAS) ---
        const GET_ALL_AGENTES = "SELECT id, nombre, imagen, elemento, rareza FROM agentes ORDER BY nombre ASC";
        const GET_ALL_ARMAS = "SELECT * FROM armas ORDER BY nombre ASC";
        const GET_ALL_DISCOS = "SELECT * FROM discos ORDER BY nombre ASC";
        const GET_ALL_MATERIALES = "SELECT * FROM materiales ORDER BY tipo ASC, nombre ASC";
        const GET_ALL_JEFES = "SELECT * FROM jefes ORDER BY nombre ASC";
        const GET_ALL_BANGBOOS = "SELECT * FROM bangboos ORDER BY rareza ASC, nombre ASC";

        // --- CONSULTAS DEL EXPEDIENTE COMPLETO ---
        const GET_AGENTE_BY_ID = "SELECT * FROM agentes WHERE id = ?";
    
        const GET_BUILD_BY_AGENTE = "SELECT b.*, 
                d4.nombre as set4_nombre, d4.imagen as set4_imagen, d4.efecto_4_piezas, d4.efecto_2_piezas as set4_efecto_2_piezas,
                d2.nombre as set2_nombre, d2.imagen as set2_imagen, d2.efecto_2_piezas,
                a1.nombre as arma1_nombre, a1.imagen as arma1_imagen,
                a2.nombre as arma2_nombre, a2.imagen as arma2_imagen,
                a3.nombre as arma3_nombre, a3.imagen as arma3_imagen
            FROM builds_recomendadas b
            LEFT JOIN discos d4 ON b.set_4_piezas_id = d4.id
            LEFT JOIN discos d2 ON b.set_2_piezas_id = d2.id
            LEFT JOIN armas a1 ON b.arma_top_1_id = a1.id
            LEFT JOIN armas a2 ON b.arma_top_2_id = a2.id
            LEFT JOIN armas a3 ON b.arma_top_3_id = a3.id
            WHERE b.agente_id = ?";

        const GET_HABILIDADES_BY_AGENTE = "SELECT * FROM habilidades WHERE agente_id = ?";
    
        const GET_EQUIPOS_BY_AGENTE = "SELECT e.*, 
                c1.nombre as comp1_nombre, c1.imagen as comp1_imagen,
                c2.nombre as comp2_nombre, c2.imagen as comp2_imagen,
                bb.nombre as bangboo_nombre, bb.imagen as bangboo_imagen
            FROM equipos_recomendados e
            LEFT JOIN agentes c1 ON e.compañero_1_id = c1.id
            LEFT JOIN agentes c2 ON e.compañero_2_id = c2.id
            LEFT JOIN bangboos bb ON e.bangboo_id = bb.id
            WHERE e.agente_id = ?";

        const GET_MATERIALES_BY_AGENTE = "SELECT ar.material_id, m.nombre, m.imagen, ar.cantidad, ar.categoria, ar.nivel_requerido
            FROM asc_requisitos ar
            JOIN materiales m ON ar.material_id = m.id
            WHERE ar.agente_id = ?";

        const GET_JEFES_BY_AGENTE = "SELECT r.jefe_id, j.nombre, j.imagen, j.debilidad_elemental, r.razon_ventaja
            FROM agente_vs_jefe r
            JOIN jefes j ON r.jefe_id = j.id
            WHERE r.agente_id = ?";

        const GET_CINE_BY_AGENTE = "SELECT * FROM cine_mental WHERE agente_id = ? ORDER BY numero ASC";

        // --- INSERCIONES ---
        const INSERT_AGENTE = "INSERT INTO agentes (
                nombre, rareza, genero, elemento, especialidad, faccion, 
                imagen, imagen_full, descripcion, base_hp, base_atk, 
                base_def, base_impacto, base_prob_crit, base_dano_crit, 
                base_anomalia_maestria, base_anomalia_tasa, base_dano_bruto, 
                base_tasa_perforacion, base_recarga_energia, base_adrenalina
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const INSERT_BUILD = "INSERT INTO builds_recomendadas (
                agente_id, arma_top_1_id, arma_top_2_id, arma_top_3_id, 
                set_4_piezas_id, set_2_piezas_id, disco_4_main, disco_5_main, disco_6_main, 
                substats_prioridad, meta_hp, meta_atk, meta_def, meta_prob_crit, 
                meta_dano_crit, meta_maestria_anomalia, meta_tasa_anomalia, 
                meta_recarga, meta_impacto, meta_tasa_perforacion, meta_dano_bruto, meta_adrenalina
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const INSERT_CINE = "INSERT INTO cine_mental (agente_id, numero, nombre, descripcion) VALUES (?, ?, ?, ?)";
    
        const INSERT_REQUISITO = "INSERT INTO asc_requisitos (agente_id, material_id, nivel_requerido, cantidad, categoria) VALUES (?, ?, ?, ?, ?)";
    
        const INSERT_HABILIDAD = "INSERT INTO habilidades (agente_id, nombre, tipo, imagen_icono, descripcion) VALUES (?, ?, ?, ?, ?)";
    
        const INSERT_AGENTE_VS_JEFE = "INSERT INTO agente_vs_jefe (agente_id, jefe_id, razon_ventaja) VALUES (?, ?, ?)";
    
        const INSERT_EQUIPO = "INSERT INTO equipos_recomendados (agente_id, compañero_1_id, compañero_2_id, bangboo_id, titulo_equipo, descripcion_estrategia) VALUES (?, ?, ?, ?, ?, ?)";

        // --- MODIFICACIONES / BORRADOS ---
        const UPDATE_AGENTE = "UPDATE agentes SET 
                nombre = ?, rareza = ?, genero = ?, elemento = ?, especialidad = ?, faccion = ?, 
                imagen = ?, imagen_full = ?, descripcion = ?, base_hp = ?, base_atk = ?, 
                base_def = ?, base_impacto = ?, base_prob_crit = ?, base_dano_crit = ?, 
                base_anomalia_maestria = ?, base_anomalia_tasa = ?, base_dano_bruto = ?, 
                base_tasa_perforacion = ?, base_recarga_energia = ?, base_adrenalina = ?
            WHERE id = ?";

        const DELETE_AGENTE_BY_NOMBRE = "DELETE FROM agentes WHERE nombre = ?";
    }