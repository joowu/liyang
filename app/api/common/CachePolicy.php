<?php
namespace common;

class CachePolicy {
    protected $policies = array();
    protected $cacheAdapter;
    protected $app;

    public function __construct($app) {
        $app->hook('slim.before.dispatch', array($this, 'checkCache'));
        $app->hook('slim.after.dispatch', array($this, 'updateCache'));
        $this->app = $app;

        $this->cacheAdapter = new CacheAdapter();
    }

    public function add($pattern) {
        $this->policies[$pattern] = array("pattern" => $pattern);
    }

    public function checkCache() {
        $req = $this->app->request();

        if ($req->isGet()) {
            $resourceUri = $req->getPathInfo();
            $env = $this->app->environment();
            $queryString = $env['QUERY_STRING'];
            if ($queryString) {
                $resourceUri = $resourceUri . "?" . $queryString;
            }

           $cache = $this->cacheAdapter->fetchCache($resourceUri);
           if ($cache && $cache["response"]) {
               $this->app->lastModified($cache["timestamp"]);
               $this->app->response()->body($cache["response"]);
               $this->app->stop();
           }
        }
    }

    public function updateCache() {
        if ($this->findPolicy()) {
            $req = $this->app->request();
            $resourceUri = $req->getPathInfo();

            if ($req->isGet()) {
                $timestamp = time();
                $this->app->lastModified($timestamp);

                $env = $this->app->environment();
                $queryString = $env['QUERY_STRING'];
                if ($queryString) {
                    $resourceUri = $resourceUri . "?" . $queryString;
                }
                $this->cacheAdapter->storeCache($resourceUri, array("timestamp" => $timestamp, "response" => ob_get_contents()));
            }

            if ($req->isPost() || $req->isPut() || $req->isDelete()) {
                $this->cacheAdapter->deleteCache($resourceUri, TRUE);
            }
        }
    }

    protected function findPolicy() {
        $route = $this->app->router()->getCurrentRoute();
        if (!$route) {
            return false;
        }
        $pattern = $route->getPattern();
        return array_key_exists($pattern, $this->policies);
    }
}