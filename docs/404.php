<?php
$uri = strtok($_SERVER['REQUEST_URI'], '?');
if (in_array($uri, array('/home', '/benchmarks', '/about', '/settings', '/terms-of-service', '/privacy-policy')))
  $found = true;
else
  $found = false;
http_response_code($found ? 200 : 404);

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");

readfile('index.html');
?>
