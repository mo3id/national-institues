<?php require 'db_config.php';

function addColumnSafe($pdo, $table, $column, $definition) {
    try {
        $pdo->exec("ALTER TABLE $table ADD COLUMN $column $definition");
        echo "Added $column to $table.<br>";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "Column $column already exists in $table.<br>";
        } else {
            throw $e;
        }
    }
}

addColumnSafe($pdo, 'news', 'content', 'longtext');
addColumnSafe($pdo, 'news', 'contentAr', 'longtext');
addColumnSafe($pdo, 'schools', 'address', 'text');
addColumnSafe($pdo, 'schools', 'addressAr', 'text');

echo 'Migration finished.';
