<?php
require "./settings.php";

function getSonarrSettings(){
    global $sonarApiKey, $sonarurl;

    $settings = array();
    $settings['apiKey'] = $sonarApiKey;
    $settings['url'] = $sonarurl;

    return $settings;
}

echo json_encode(getSonarrSettings());

?>
