<?php
session_start();
$session_id = session_id();
$action = $_GET["remove"];
$_table = "u_users";
$_table1 = "u_race";

if (isset($action) && $action == "player") {
    actionDelete($_table, $session_id);
    unset($session_id);
}
// TODO: else

function actionDelete($_table, $session_id) {
    $link = open_database_connection();

    $query = "
        DELETE FROM $_table
        WHERE session = '$session_id'
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
