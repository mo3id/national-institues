<?php
// Security: remove this diagnostic file
$me = __FILE__;
if (file_exists($me)) {
    unlink($me);
    echo "REMOVED";
} else {
    echo "ALREADY_GONE";
}