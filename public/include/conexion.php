<?php
    require_once __DIR__.'/../../src/db.php';

    $server = 'Localhost';
    $user = 'root';
    $pass = '';
    $db = 'zzz_wiki';

    $conn = null;

    try{
        $conn = db::openCon($server, $user, $db, $pass);
    }catch(RuntimeException $e){
        die('Error: '. $e->getMessage());
    }
?>