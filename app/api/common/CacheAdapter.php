<?php
namespace common;

class CacheAdapter  {
    protected $cacheable;

    public function __construct() {
        $this->cacheable = extension_loaded("apc");
        if (!$this->cacheable) {
            $this->getLog()->warn("Module apc need for cache. Please install it.");
        }
    }

    protected function getLog() {
        return \Slim\Slim::getInstance()->getLog();
    }

    public function fetchCache($uri) {
        if (!$this->cacheable) {
            return false;
        }

        $value = apc_fetch($uri);
        if ($value) {
            $this->getLog()->debug("Hit cache for $uri");
        }
        return $value;
    }

    public function storeCache($uri, $value, $ttl = 3600) {
        if (!$this->cacheable) {
            return false;
        }

        $this->getLog()->debug("put $uri into cache");
        apc_store($uri, $value, $ttl);
    }

    public function deleteCache($uri, $deleteAncestors = FALSE) {
        if (!$this->cacheable) {
            return false;
        }

        if ($deleteAncestors) {
            $patterns = array();
            $key = $uri;
            do{
                $patterns[] = preg_quote($key, '/') . "(\\?.*)?";
                $pos = strrpos($key, "/");
            } while ($pos > 0 && ($key = substr($key, 0, $pos)));

            foreach (new APCIterator('user', '/^('.implode('|', $patterns).')$/') as $cache) {
                $this->deleteSingleCache($cache['key']);
            }
        } else {
            $this->deleteSingleCache($uri);
        }
    }

    protected function deleteSingleCache($uri) {
        $this->getLog()->debug("remove $uri from cache");
        apc_delete($uri);
    }
}
