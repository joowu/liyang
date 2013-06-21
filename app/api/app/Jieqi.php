<?php
namespace app;

use \common\DB;

Class Jieqi {
    public function findJie($time) {
        $sql = "select year, month, jieqi from ym_lkp where start_tm <= %t order by start_tm desc";
        return DB::queryFirstRow($sql, $time);
    }
}