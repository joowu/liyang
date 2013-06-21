<?php
namespace common;

require_once 'vendor/conNeg.inc.php';

class ContentNegotiation
{
    protected $accepts;

    public function __construct($settings = array())
    {
        $this->accepts = array_merge(array(
            'application/json' => array($this, 'formatJson'),
            'text/csv' => array($this, 'formatCsv')
        ), $settings);
    }

    public function wrap($callable) {
        $parent = $this;
        return function () use ($callable, $parent) {
            $result = call_user_func_array($callable, func_get_args());
            if ($result) {
                $mimeType = \conNeg::mimeBest();
                if ($mimeType) {
                    echo $parent->format($result, $mimeType);
                } else {
                    echo $result;
                }
            }
        };
    }

    public function format($output, $mimeType)
    {
        if (isset($this->accepts[$mimeType]) && is_callable($this->accepts[$mimeType])) {
            return call_user_func($this->accepts[$mimeType], $output);
        } else {
            return $output;
        }
    }

    private function formatJson($output)
    {
        return json_encode($output);
    }

    private function formatCsv($output)
    {
        $fileName = 'php://memory';
        $temp = fopen($fileName, 'rw');

        foreach ($output as $fields) {
            fputcsv($temp, $fields);
        }

        fseek($temp, 0);
        $contents = '';
        while (!feof($temp)) {
            $contents .= fread($temp, 8192);
        }
        fclose($temp);

        return $contents;
    }
}