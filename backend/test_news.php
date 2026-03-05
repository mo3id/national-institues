<?php require 'db_config.php'; print_r($pdo->query('SELECT * FROM news')->fetchAll());
