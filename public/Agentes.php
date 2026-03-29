<?php
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

    require_once __DIR__ . '/include/conexion.php';
    require_once __DIR__ . '/../src/AgenteController.php';

    // RUTA 1: Obtener la lista lateral
    $app->get('/agentes', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);

        $response->getBody()->write(json_encode($agente->getAll(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response;
    });

    // RUTA 2: Obtener los datos completos
    $app->get('/agentes/{id}', function (Request $request, Response $response, array $args) use ($conn) {
        $agente = new AgenteController($conn);

        $response->getBody()->write(json_encode($agente->getCompleto($args['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response;
    });

    // RUTA 3: Insertar Agente
    $app->post('/agentes', function (Request $request, Response $response, $args) use ($conn) {
        $agente = new AgenteController($conn);
        $datos = $request->getParsedBody();

        // Validación para que al menos envíen el nombre
        if (empty($datos['nombre'])) {
            $resultado = ['status' => 'error', 'mensaje' => 'El nombre es obligatorio.'];
        } else {
            $resultado = $agente->insertarAgente($datos);
        }

        $response->getBody()->write(json_encode($resultado));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 3: Borrar Agente
    $app->delete('/agentes', function (Request $request, Response $response, $args) use ($conn) {
        $agente = new AgenteController($conn);
        $datos = $request->getParsedBody();

        if (empty($datos['nombre'])) {
            $resultado = ['status' => 'error', 'mensaje' => 'Debes indicar el nombre del agente a borrar.'];
        } else {
            $resultado = $agente->borrarAgente($datos['nombre']);
        }

        $response->getBody()->write(json_encode($resultado));
        return $response->withHeader('Content-Type', 'application/json');
    });
	
	// RUTA 5: Modificar Agente
    $app->put('/agentes/{id}', function (Request $request, Response $response, array $args) use ($conn) {
        $agente = new AgenteController($conn);
        $datos = $request->getParsedBody();
        
        $id_agente = $args['id']; 

        if (empty($datos['nombre'])) {
            $resultado = ['status' => 'error', 'mensaje' => 'El nombre no puede quedar vacío.'];
        } else {
            $resultado = $agente->modificarAgente($id_agente, $datos);
        }

        $response->getBody()->write(json_encode($resultado));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 6: Get armas
    $app->get('/armas', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);

        $response->getBody()->write(json_encode($agente->getAllArmas(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 6: Get materiales
    $app->get('/materiales', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);
        
        $response->getBody()->write(json_encode($agente->getAllMateriales(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 6: Get disos
    $app->get('/discos', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);

        $response->getBody()->write(json_encode($agente->getAllDiscos(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 6: Get bangboos
    $app->get('/bangboos', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);

        $response->getBody()->write(json_encode($agente->getAllBangboos(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // RUTA 6: Get jefes
    $app->get('/jefes', function (Request $request, Response $response) use ($conn) {
        $agente = new AgenteController($conn);
        
        $response->getBody()->write(json_encode($agente->getAllJefes(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    });