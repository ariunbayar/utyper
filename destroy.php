<?php
session_start();
$session_id = session_id();
$remove = $_GET["remove"];
$_table = "race";
$_table2 = "u_race";

switch ($remove) {
    case "player" : actionDelete($_table, $session_id); break;
    case "race"   : actionDeleteRace($_table2, $session_id); break;
}

function actionDelete($_table, $session_id) {
    $link = open_database_connection();

    $query = "
        DELETE FROM $_table
        WHERE `session_id` = '$session_id'
    ";
    $result = mysqli_query($link, $query) or die(mysql_error());

    close_database_connection($link);
}

function actionDeleteRace($_table2, $session_id) {
    $link = open_database_connection();

    $query = "
        DELETE FROM $_table2
        WHERE `creator` = '$session_id'
    ";
    $result = mysqli_query($link, $query) or die(mysql_error());

    close_database_connection($link);
}

function open_database_connection()
{
    require 'local_settings.php';
    $link = mysqli_connect($db_host, $db_username, $db_password, $db_name);
    mysqli_query($link, "SET NAMES 'UTF8'");
    return $link;
}

function close_database_connection($link)
{
    mysqli_close($link);
}

?>
