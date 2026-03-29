<?php
    session_start();

    $metodo = $_SERVER['REQUEST_METHOD'];

    // Candado de seguridad para métodos destructivos/creativos
    if ($metodo === 'POST' || $metodo === 'DELETE' || $metodo === 'PUT') {
        if (!isset($_SESSION['admin_logeado']) || $_SESSION['admin_logeado'] !== true) {
            // Error 401 (No autorizado) por si hace peticiones sin estar logueado
            http_response_code(401);
            echo json_encode(['status' => 'error', 'mensaje' => 'Acceso denegado. Inicia sesión.']);
            exit();
        }
    }

    use Slim\Factory\AppFactory;
    use Psr\Http\Message\ResponseInterface as Response;
    use Psr\Http\Message\ServerRequestInterface as Request;

    require_once __DIR__.'/../vendor/autoload.php';

    // Instanciar el SLIM
    $app = AppFactory::create();

    // Añadimos middleware para parseado del body, routing y errores
    $app->addBodyParsingMiddleware();
    $app->addRoutingMiddleware();
    $app->addErrorMiddleware(true, true, true);

    // URL relativa del fichero index.php
    $app->setBasePath("/ProyectoZZZ/ApiRest");

    // Servicio de utilidad que muestra todas las rutas disponibles en el objeto app actual con sus métodos
    $app->get('/tests/get-routes/', function ($request, $response, $args) use ($app) {
        $routes = $app->getRouteCollector()->getRoutes();
        foreach ($routes as $route) {
            echo $route->getIdentifier() . " → ";
            echo ($route->getName() ?? "(unnamed)") . " → ";
            echo $route->getPattern();
            echo "<br>";
            print_r($route->getMethods());
            echo "<br><br>";
        }

        return $response;
    });

    require __DIR__.'/Agentes.php';

    $app->run();
?>