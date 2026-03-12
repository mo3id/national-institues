<?php
require "db_config.php";
try {
    $sql = "INSERT INTO governorates (id, name, nameAr) VALUES 
    (\"1\", \"Cairo\", \"القاهرة\"), 
    (\"2\", \"Alexandria\", \"الإسكندرية\"), 
    (\"3\", \"Giza\", \"الجيزة\"), 
    (\"4\", \"Dakahlia\", \"الدقهلية\"), 
    (\"5\", \"Gharbia\", \"الغربية\")
    ON DUPLICATE KEY UPDATE name=VALUES(name), nameAr=VALUES(nameAr);";
    $pdo->exec($sql);
    echo "Data inserted successfully!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
