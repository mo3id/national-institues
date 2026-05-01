<?php
require "db_config.php";
try {
    $pdo->exec("TRUNCATE TABLE governorates");
    $sql = "INSERT INTO governorates (id, name, nameAr) VALUES 
    ('1', 'Cairo', 'القاهرة'), 
    ('1773323691575', 'Minya', 'المنيا'), 
    ('1773323708257', 'Portsaid', 'بورسعيد'), 
    ('2', 'Alexandria', 'الإسكندرية'), 
    ('3', 'Giza', 'الجيزة')";
    $pdo->exec($sql);
    echo "<h1>تمت استعادة المحافظات الخمس الأساسية بنجاح!</h1>";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
