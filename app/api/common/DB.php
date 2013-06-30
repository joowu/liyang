<?php
namespace common;

require_once 'vendor/meekrodb.php';

use \DB as Meekro;

class DB {
    public static function config($setting) {
        Meekro::$host = $setting['host'] ;
        Meekro::$port = $setting['port'];
        Meekro::$user = $setting['user_name'];
        Meekro::$password = $setting['password'];
        Meekro::$dbName = $setting['db'];
        Meekro::$encoding = $setting['encoding'];
    }

    public static function __callStatic($method, $arguments) {
        $result = forward_static_call_array(array('\DB', $method), $arguments);
        if ($result) {
            $result = self::convert($result);
        }

        return $result;
    }

    private static function convert($source) {
        if (is_array($source)) {
            $target = array();
            foreach ($source as $k => $v) {
                $keys = explode('.', $k);
                $parent = &$target;
                do {
                    $key = array_shift($keys);
                    if (empty($keys)) {
                        $parent[$key] = self::convert($v);
                        break;
                    } else {
                        if (!array_key_exists($key, $parent)) {
                            $parent[$key] = array();
                        }
                        $parent = &$parent[$key];
                    }
                } while (true);
            }
            return $target;
        } else {
            if (is_numeric($source)) {
                return 0 + $source;
            }
            if (is_bool($source)) {
                return (bool)$source;
            }
            $time = strtotime($source);
            if ($time) {
                return date('c', $time);
            }
            $json = json_decode($source);
            if (json_last_error() == JSON_ERROR_NONE) {
                return $json;
            }
            return $source;
        }
    }
}