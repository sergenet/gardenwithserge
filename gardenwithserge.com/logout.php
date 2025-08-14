<?php
session_start();
session_unset();
session_destroy();
// Reset language cookie to English
setcookie('language', 'en', time() + (365 * 24 * 60 * 60), "/");
header("Location: index.html");
exit;
?>