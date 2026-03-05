<?php require 'db_config.php'; 
$pdo->exec('ALTER TABLE news ADD COLUMN IF NOT EXISTS content longtext, ADD COLUMN IF NOT EXISTS contentAr longtext'); 
$pdo->exec('ALTER TABLE schools ADD COLUMN IF NOT EXISTS address text, ADD COLUMN IF NOT EXISTS addressAr text'); 
echo 'Done';
