<?php

require "./settings.php";


/*
** Get episode information from KODI Database
*/


/* SQL queries */
$SQLepisodes = sprintf("
SELECT episode_view.idEpisode, episode_view.c12 as season, episode_view.c13 as episode, episode_view.playCount, tvshow.c12 as tvdb, tvshow.c00 as series
FROM episode_view
JOIN tvshow on episode_view.idShow = tvshow.idShow WHERE playCount >= 1
");

function getWatchedEpisodes(){

    global $SQLepisodes, $mysqlU, $mysqlP, $mysqlH, $mysqlDB;

    $watchedepisodeslist = array();;

    $xbmc = mysql_connect($mysqlH, $mysqlU, $mysqlP);

    if (!$xbmc) {
        die('Could not connect: ' . mysql_error());
    }

    mysql_select_db($mysqlDB);
    $watchedepisodes = mysql_query($SQLepisodes);

    //check if we got data back from db
    if (!$watchedepisodes) {
        $message  = 'Invalid query: ' . mysql_error() . "\n";
        $message .= 'Whole query: ' . $SQLepisodes;
        die($message);
    }

    //parse mysql data to array list
    while ($row = mysql_fetch_assoc($watchedepisodes)) {
        array_push($watchedepisodeslist, $row);
    }

    mysql_close();
    return $watchedepisodeslist;
}

echo json_encode(getWatchedEpisodes());

?>
