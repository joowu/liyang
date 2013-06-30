<?php
namespace app;

use \common\DB;

class Name
{
    public function findChineseName($factors)
    {
        $factors['xingshi'] = $this->splitCharacters($factors['xingshi']);
        $factors['bihui'] = $this->splitCharacters($factors['bihui']);
        $factors['bihu'] = $this->splitCharacters($factors['bihu']);

        $sql = "SELECT x.hz, x.bhs, x.nywx, t.xywx, x.flag
                    FROM xmx x join tangan t on t.yinyang=x.yinyang and t.wx=x.zxwx
                    where x.xs=%i and x.hz = %s";
        $firstCharacter = DB::queryFirstRow($sql, 1, $factors['xingshi'][0]);
        $lastCharacters[] = $firstCharacter;

        $xs_bhs = $firstCharacter['bhs'];
        for($i=1; $i<count($factors['xingshi']); $i++) {
            $secondCharacter = DB::queryFirstRow($sql, 0, $factors['xingshi'][$i]);
            $lastCharacters[] = $secondCharacter;
            $xs_bhs += $secondCharacter['bhs'];
        }

        if ($factors['danming']) {
            $sql = "select x.hz, x.bhs, x.nywx, t.xywx, x.flag
	              from (select a.ls - $xs_bhs as bhs1
                      from wsl a, wsl d
                      where 1=1
                        and " . ($factors['jie_rd'] ? " a.jx='吉' and " : "") . "a.ls > $xs_bhs and mod(a.ls,2)=1
                        and d.jx= '吉' and a.ls - $xs_bhs = d.ls) as h
                       join xmx x on x.bhs = h.bhs1
                       join tangan t on t.yinyang=x.yinyang and t.wx=x.zxwx
                  where 1=1
                    and x.xs=0 and x.flag in (1,2) and x.nywx = '" . $factors['chars'][0]['nywx'] . "'
                    " . ($factors['xywx'] ? " and x.yinyang=" . $factors['chars'][0]['xyyy_'] . " and x.zxwx='" . $factors['chars'][0]['xywx'] . "'" : "") . "
                    " . ($factors['bihui'] ? " and x.hz not in ['" . implode("', '", $factors['bihui']) . "']" : "") . "
   	              order by x.flag, x.hz";

            $characters = DB::query($sql);
            return array(
                "characters" => $characters,
                "count" => count($characters),
                "lastName" => $lastCharacters,
                "firstNames" => array_map(function($character) {
                    return array($character['hz']);
                }, $characters)
            );
        } else {
            $sql = "select CONCAT('[\"', x.hz, '\", \"', y.hz, '\"]')
	              from (select a.ls - $xs_bhs as bhs1, b.ls - $xs_bhs as bhs2
                      from wsl a, wsl b, wsl c, wsl d
                      where 1=1
                        and " . ($factors['jie_tr'] ? " a.jx='吉' and " : "") . "a.ls > $xs_bhs
                        and " . ($factors['jie_td'] ? " b.jx='吉' and " : "") . "b.ls > $xs_bhs and mod(b.ls,2)=1
                        and c.jx= '吉' and mod (a.ls + b.ls - $xs_bhs * 2, 81) = c.ls
                        and d.jx= '吉' and mod (a.ls + b.ls - $xs_bhs, 81) = d.ls) as h
                       join xmx x on x.bhs = h.bhs1
                       join xmx y on y.bhs = h.bhs2
                  where x.zxwx<>y.zxwx
                    and x.xs=0 and x.flag in (1,2) and x.nywx = '" . $factors['chars'][0]['nywx'] . "'
                    and y.xs=0 and y.flag in (1,2) and y.nywx = '" . $factors['chars'][1]['nywx'] . "'
                    " . ($factors['xywx']
                ? " and x.yinyang=" . $factors['chars'][0]['xyyy'] . " and x.zxwx='" . $factors['chars'][0]['xywx'] . "'"
                    . " and y.yinyang=" . $factors['chars'][1]['xyyy'] . " and y.zxwx='" . $factors['chars'][1]['xywx'] . "'"
                : "") . "
                    " . ($factors['bihui'] ? " and x.hz not in ('" . implode("', '", $factors['bihui']) . "')"
                . " and y.hz not in ('" . implode("', '", $factors['bihui']) . "')"
                : "") . "
   	              order by x.flag + y.flag, x.hz, y.hz";
            $firstNames = DB::queryFirstColumn($sql);

            $firstCharacters = array();
            $secondCharacters = array();
            foreach ($firstNames as $firstName) {
                $firstCharacters[] = $firstName[0];
                if (!$factors['danming']) {
                    $secondCharacters[] = $firstName[1];
                }
            }
            $firstCharacters = array_values(array_unique($firstCharacters));
            $secondCharacters = array_values(array_unique($secondCharacters));

            $characters = array_merge($firstCharacters, $secondCharacters);
            $sql = "select x.hz, x.bhs, x.nywx, t.xywx, x.flag
                  from xmx x join tangan t on t.yinyang=x.yinyang and t.wx=x.zxwx
                  where x.flag in (1,2) and x.hz in %ls";
            $characters = DB::query($sql, $characters);

            return array(
                "firstCharacters" => $firstCharacters,
                "secondCharacters" => $secondCharacters,
                "characters" => $characters,
                "count" => count($firstNames),
                "lastName" => $lastCharacters,
                "firstNames" => array_slice($firstNames, 0, 100)
            );
        }
    }

    private function splitCharacters($string)
    {
        $charset = mb_detect_encoding($string);
        $countOfLast = iconv_strlen($string, $charset);
        $characters = array();
        for ($i = 0; $i < $countOfLast; $i++) {
            $characters[] = iconv_substr($string, $i, 1, $charset);
        }
        return $characters;
    }
}