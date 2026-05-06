<?php
$pdo = "PDO Object";
$arr = [1, 2];
$res = array_filter($arr, function($item) {
    global $pdo;
    echo $pdo;
    return true;
});
