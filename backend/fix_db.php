<?php
require 'db_config.php';

echo "Updating schools table...\n";

try {
    $stmt1 = $pdo->prepare("UPDATE schools SET type = 'Arabic' WHERE type = 'National'");
    $stmt1->execute();
    echo "Updated " . $stmt1->rowCount() . " National to Arabic\n";

    $stmt2 = $pdo->prepare("UPDATE schools SET type = 'Languages' WHERE type = 'Language'");
    $stmt2->execute();
    echo "Updated " . $stmt2->rowCount() . " Language to Languages\n";

    $stmt3 = $pdo->prepare("UPDATE schools SET type = 'American' WHERE type = 'International'");
    $stmt3->execute();
    echo "Updated " . $stmt3->rowCount() . " International to American\n";

    echo "Done.\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
