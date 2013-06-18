<?php
require 'lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

date_default_timezone_set('America/Los_Angeles');

$app = new \Slim\Slim();
$app->add(new \Slim\Middleware\ContentTypes());

$app->get('/things', function() use ($app){
    get("things", $app);
});

$app->get('/users/current', function() use ($app) {
    get("user", $app);
});
$app->post('/users/login', function() use ($app) {
    $app->setCookie('is_logon', 'true', '1 hour');
    echo json_encode(array("status" => "success"));
});
$app->post('/users/logout', function() use ($app) {
    $app->deleteCookie('is_logon');
});

$app->run();

function get($name, $app) {
    if ('true' != $app->getCookie('is_logon')) {
        $app->halt(401);
    }
    try {
        $app->render("$name.json");
    } catch (RuntimeException $e) {
        $app->notFound();
    }
}

function post($app) {
    if ('true' != $app->getCookie('is_logon')) {
        $app->halt(401);
    }
    $entity = $app->request()->getBody();
    $entity['id'] = 99;
    echo json_encode($entity);
}

function put($app) {
    if ('true' != $app->getCookie('is_logon')) {
        $app->halt(401);
    }
    echo json_encode($app->request()->getBody());
}
