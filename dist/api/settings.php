<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
ini_set('error_reporting', 'E_ALL | E_STRICT');

/* sonar */
$sonarApiKey = '7936875896514603891816219d4daaf0';
$sonarurl = 'http://192.168.1.100:8989/sonarr/api/';

/* mysql */
$mysqlU = 'xbmc'; //your mysql user
$mysqlP = 'xbmc'; //your mysql password
$mysqlH = '192.168.1.100'; //your mysql host
$mysqlDB = 'MyVideos93'; //the database for kodi

?>