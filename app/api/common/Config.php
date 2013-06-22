<?php
namespace common;

class Config
{
    private static $PATH = "config/";
    private static $DEFAULT_NAME = "default";
    private $configuration;

    public function __construct($mode = FALSE)
    {
        $this->configuration = parse_ini_file(self::$PATH . self::$DEFAULT_NAME . ".ini", true);
        if ($mode) {
            $this->configuration = array_merge_recursive($this->configuration, parse_ini_file(self::$PATH . "$mode.ini", true));
        }
    }

    public function get($section)
    {
        if (array_key_exists($section, $this->configuration)) {
            return $this->configuration[$section];
        } else {
            return array();
        }
    }

    public static function autoload($className)
    {
        $className = ltrim($className, '\\');

        $fileName = '';
        if ($lastNsPos = strripos($className, '\\')) {
            $namespace = substr($className, 0, $lastNsPos);
            $className = substr($className, $lastNsPos + 1);
            $fileName = str_replace('\\', DIRECTORY_SEPARATOR, $namespace) . DIRECTORY_SEPARATOR;
        }
        $fileName .= str_replace('_', DIRECTORY_SEPARATOR, $className) . '.php';

        if (file_exists($fileName)) {
            require $fileName;
        }
    }

    public static function registerAutoloader()
    {
        spl_autoload_register(__NAMESPACE__ . "\\Config::autoload");
    }
}