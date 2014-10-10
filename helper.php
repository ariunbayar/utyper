<?php

function actionCheckTable($_table) {
    $link = open_database_connection();

    $query = "
            SELECT `id` FROM $_table
        ";
    $result = mysqli_query($link, $query) or die(mysqli_error());

    close_database_connection($link);

    return $result->num_rows;
}


function actionGetTimer($_table, $session_id) {
    $link = open_database_connection();

    $query = "
            SELECT `timer` FROM $_table
            WHERE `session_id` = '$session_id'
        ";
    $result = mysqli_query($link, $query) or die(mysqli_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["timer"];

    close_database_connection($link);

    return (int)$rsp;
}

function actionGetName($_table) {
    $link = open_database_connection();

    $query = "
            SELECT `name` FROM $_table
        ";
    $result = mysqli_query($link, $query) or die(mysqli_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["name"];

    close_database_connection($link);

    return $rsp;
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
