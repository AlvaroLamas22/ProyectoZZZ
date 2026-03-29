<?php
require_once 'AgenteQueries.php'; // Incluimos el archivo de consultas

class AgenteController {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. Obtener listas
        public function getAll() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_AGENTES); }
        public function getAllArmas() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_ARMAS); }
        public function getAllDiscos() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_DISCOS); }
        public function getAllMateriales() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_MATERIALES); }
        public function getAllJefes() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_JEFES); }
        public function getAllBangboos() { return $this->ejecutarSelect(AgenteQueries::GET_ALL_BANGBOOS); }

        // Función auxiliar para ahorrarnos repetir código en todas las listas
        private function ejecutarSelect($sql) {
            try {
                $stmt = $this->conn->prepare($sql);
                $stmt->execute();
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                return ['error' => $e->getMessage()];
            }
        }

        // 2. Obtener TODO de un agente
        public function getCompleto($id) {
            try {
                $data = [];
            
                // Info Base
                $stmt = $this->conn->prepare(AgenteQueries::GET_AGENTE_BY_ID);
                $stmt->execute([$id]);
                if ($stmt->rowCount() == 0) return null;
                $data['info'] = $stmt->fetch(PDO::FETCH_ASSOC);

                // Fetch relations
                $data['build'] = $this->fetchUnico(AgenteQueries::GET_BUILD_BY_AGENTE, $id);
                $data['habilidades'] = $this->fetchMultiple(AgenteQueries::GET_HABILIDADES_BY_AGENTE, $id);
                $data['equipos'] = $this->fetchMultiple(AgenteQueries::GET_EQUIPOS_BY_AGENTE, $id);
                $data['materiales'] = $this->fetchMultiple(AgenteQueries::GET_MATERIALES_BY_AGENTE, $id);
                $data['ventajas'] = $this->fetchMultiple(AgenteQueries::GET_JEFES_BY_AGENTE, $id);
                $data['discos_mentales'] = $this->fetchMultiple(AgenteQueries::GET_CINE_BY_AGENTE, $id);

                return $data;
            } catch (PDOException $e) {
                return ['error' => 'Error en la BD: ' . $e->getMessage()];
            }
        }

        // 3. INSERTAR AGENTE
        public function insertarAgente($datos) {
            try {
                $this->conn->beginTransaction();

                $stmtAgente = $this->conn->prepare(AgenteQueries::INSERT_AGENTE);
                $this->bindDatosBase($stmtAgente, $datos);
                $stmtAgente->execute();
                $agente_id = $this->conn->lastInsertId();

                // Llamamos a los Helpers para insertar las tablas relacionadas
                $this->insertarRelaciones($agente_id, $datos);

                $this->conn->commit();
                return ['status' => 'success', 'mensaje' => 'Agente y todo su expediente insertados correctamente.', 'id' => $agente_id];
            } catch (PDOException $e) {
                $this->conn->rollBack();
                return ['status' => 'error', 'mensaje' => 'Error al insertar en la BD: ' . $e->getMessage()];
            }
        }

        // 4. MODIFICAR AGENTE
        public function modificarAgente($id, $datos) {
            try {
                $this->conn->beginTransaction();

                $stmtAgente = $this->conn->prepare(AgenteQueries::UPDATE_AGENTE);
                $this->bindDatosBase($stmtAgente, $datos);
                $stmtAgente->bindValue(22, $id, PDO::PARAM_INT); // El ID va al final del UPDATE
                $stmtAgente->execute();

                // Borramos relaciones antiguas
                $this->borrarRelacionesViejas($id);

                // Re-insertamos usando la misma función Helper que el INSERT
                $this->insertarRelaciones($id, $datos);

                $this->conn->commit();
                return ['status' => 'success', 'mensaje' => 'Agente y expediente actualizados correctamente.'];
            } catch (PDOException $e) {
                $this->conn->rollBack();
                return ['status' => 'error', 'mensaje' => 'Error al actualizar en la BD: ' . $e->getMessage()];
            }
        }

        // 5. BORRAR AGENTE
        public function borrarAgente($nombre) {
            try {
                $stmt = $this->conn->prepare(AgenteQueries::DELETE_AGENTE_BY_NOMBRE);
                $stmt->execute([$nombre]);
                if ($stmt->rowCount() > 0) {
                    return ['status' => 'success', 'mensaje' => "El agente '$nombre' ha sido eliminado."];
                }
                return ['status' => 'error', 'mensaje' => "No se encontró el agente '$nombre'."];
            } catch (PDOException $e) {
                return ['status' => 'error', 'mensaje' => 'Error al borrar: ' . $e->getMessage()];
            }
        }

        // ======================================================================================
        // FUNCIONES PRIVADAS (HELPERS) - ¡EL SECRETO PARA AHORRAR 200 LÍNEAS DE CÓDIGO!
        // ======================================================================================

        private function fetchUnico($query, $id) {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        }

        private function fetchMultiple($query, $id) {
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        private function borrarRelacionesViejas($id) {
            $tablas = ['builds_recomendadas', 'cine_mental', 'asc_requisitos', 'habilidades', 'agente_vs_jefe', 'equipos_recomendados'];
            foreach ($tablas as $tabla) {
                // Aquí usamos SQL dinámico de forma segura porque sabemos las tablas exactas
                $stmt = $this->conn->prepare("DELETE FROM $tabla WHERE agente_id = ?");
                $stmt->execute([$id]);
            }
        }

        private function insertarRelaciones($id, $datos) {
            if (isset($datos['build'])) {
                $b = $datos['build'];
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_BUILD);
                $stmt->execute([
                    $id, $b['arma_top_1_id'] ?? null, $b['arma_top_2_id'] ?? null, $b['arma_top_3_id'] ?? null, 
                    $b['set_4_piezas_id'] ?? null, $b['set_2_piezas_id'] ?? null, $b['disco_4_main'] ?? null, 
                    $b['disco_5_main'] ?? null, $b['disco_6_main'] ?? null, $b['substats_prioridad'] ?? null, 
                    $b['meta_hp'] ?? null, $b['meta_atk'] ?? null, $b['meta_def'] ?? null, $b['meta_prob_crit'] ?? null, 
                    $b['meta_dano_crit'] ?? null, $b['meta_maestria_anomalia'] ?? null, $b['meta_tasa_anomalia'] ?? null, 
                    $b['meta_recarga'] ?? null, $b['meta_impacto'] ?? null, $b['meta_tasa_perforacion'] ?? null, 
                    $b['meta_dano_bruto'] ?? null, $b['meta_adrenalina'] ?? null
                ]);
            }

            if (!empty($datos['cine_mental'])) {
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_CINE);
                foreach ($datos['cine_mental'] as $cine) {
                    $stmt->execute([$id, $cine['numero'], $cine['nombre'] ?? '', $cine['descripcion'] ?? '']);
                }
            }

            if (!empty($datos['asc_requisitos'])) {
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_REQUISITO);
                foreach ($datos['asc_requisitos'] as $req) {
                    $stmt->execute([$id, $req['material_id'], $req['nivel_requerido'] ?? 60, $req['cantidad'] ?? 1, $req['categoria']]);
                }
            }

            if (!empty($datos['habilidades'])) {
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_HABILIDAD);
                foreach ($datos['habilidades'] as $hab) {
                    $stmt->execute([$id, $hab['nombre'], $hab['tipo'], $hab['imagen_icono'] ?? null, $hab['descripcion'] ?? '']);
                }
            }

            if (!empty($datos['agente_vs_jefe'])) {
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_AGENTE_VS_JEFE);
                foreach ($datos['agente_vs_jefe'] as $avj) {
                    $stmt->execute([$id, $avj['jefe_id'], $avj['razon_ventaja'] ?? '']);
                }
            }

            if (!empty($datos['equipos'])) {
                $stmt = $this->conn->prepare(AgenteQueries::INSERT_EQUIPO);
                foreach ($datos['equipos'] as $eq) {
                    $stmt->execute([$id, $eq['compañero_1_id'] ?? null, $eq['compañero_2_id'] ?? null, $eq['bangboo_id'] ?? null, $eq['titulo_equipo'] ?? 'Equipo Recomendado', $eq['descripcion_estrategia'] ?? '']);
                }
            }
        }

        private function bindDatosBase($stmt, $datos) {
            $stmt->bindValue(1, $datos['nombre']);
            $stmt->bindValue(2, $datos['rareza'] ?? 'A');
            $stmt->bindValue(3, $datos['genero'] ?? 'Desconocido');
            $stmt->bindValue(4, $datos['elemento'] ?? 'Físico');
            $stmt->bindValue(5, $datos['especialidad'] ?? 'Atacante');
            $stmt->bindValue(6, $datos['faccion'] ?? 'Desconocido');
            $stmt->bindValue(7, $datos['imagen'] ?? 'assets/img/agentes/default.webp');
            $stmt->bindValue(8, $datos['imagen_full'] ?? 'assets/img/agentes/splash/default_full.webp');
            $stmt->bindValue(9, $datos['descripcion'] ?? '');
            $stmt->bindValue(10, $datos['base_hp'] ?? 0);
            $stmt->bindValue(11, $datos['base_atk'] ?? 0);
            $stmt->bindValue(12, $datos['base_def'] ?? 0);
            $stmt->bindValue(13, $datos['base_impacto'] ?? 0);
            $stmt->bindValue(14, $datos['base_prob_crit'] ?? '5%');
            $stmt->bindValue(15, $datos['base_dano_crit'] ?? '50%');
            $stmt->bindValue(16, $datos['base_anomalia_maestria'] ?? 0);
            $stmt->bindValue(17, $datos['base_anomalia_tasa'] ?? 0);
            $stmt->bindValue(18, $datos['base_dano_bruto'] ?? 0);
            $stmt->bindValue(19, $datos['base_tasa_perforacion'] ?? '0%');
            $stmt->bindValue(20, $datos['base_recarga_energia'] ?? '1.2');
            $stmt->bindValue(21, $datos['base_adrenalina'] ?? 0);
        }
    }