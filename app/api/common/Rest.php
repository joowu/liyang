<?php
namespace common;

require_once "vendor/Slim/Slim.php";
\Slim\Slim::registerAutoloader();

class Rest {
    private static $methods = array("get", "post", "put", "delete", "options");
    private $app;
    private $contentNegotiation;
    private $cachePolicy;

    public function __construct() {
        $this->app = new \Slim\Slim(array('log.level' => \Slim\Log::DEBUG));
        $this->app->add(new \Slim\Middleware\ContentTypes());
        $this->contentNegotiation = new ContentNegotiation();
        $this->cachePolicy = new CachePolicy($this->app);
    }

    public function __call($method, $arguments) {
        if (in_array($method, self::$methods)) {
            return $this->execute($method, $arguments);
        } else {
            return call_user_func_array(array($this->app, $method), $arguments);
        }
    }

    private function execute($method, $arguments) {
        if (is_bool(end($arguments))) {
            if (array_pop($arguments)) {
                $this->cachePolicy->add($arguments[0]);
            }
        }
        $callable = $this->contentNegotiation->wrap(array_pop($arguments));
        array_push($arguments, $callable);
        return call_user_func_array(array($this->app, $method), $arguments);
    }
}