<?php
$schema = file_get_contents('backend/schema.sql');
$oldDb = file_get_contents('database.sql');

preg_match_all('/INSERT INTO `?[a-zA-Z0-9_]+`? [^\n]+;/', $oldDb, $matches);
$inserts = implode("\n", $matches[0]);

file_put_contents('local_xamp_database.sql', $schema . "\n\n-- INITIAL DATA --\n\n" . $inserts);
echo "local_xamp_database.sql created.\n";
