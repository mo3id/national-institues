<?php require 'db_config.php'; $pdo->exec('ALTER TABLE news ADD COLUMN content longtext, ADD COLUMN contentAr longtext'); echo 'Done';
