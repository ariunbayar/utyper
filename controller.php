<?php
session_start();
$get_count = true;
$session_id = session_id();
$cpm = $_GET["cpm"];
$_table = "u_users";

if (isset($cpm)) $get_count = false;

if (isset($session_id)) {
    // Check session id
    $result = actionCheck($session_id, $_table);
    $count = $result->num_rows;

    if ($count == 0) {
        $is_edit = false;
        actionSave($_table, $session_id, $is_edit, $cpm);
    } else {
        $is_edit = true;
        actionSave($_table, $session_id, $is_edit, $cpm);
    }

    $response = actionGetAll($_table, $get_count);
    echo $response;
}

function actionCheck($session_id, $_table) {
    $link = open_database_connection();
    $query = "
            SELECT * FROM $_table
            WHERE `session` = '$session_id'
            ";
    $result = mysqli_query($link, $query) or die(mysql_error());
    close_database_connection($link);

    return $result;
}


function actionGetAll($_table, $get_count) {
    $link = open_database_connection();

    $query = "SELECT `cpm` FROM $_table";
    $result = mysqli_query($link, $query) or die(mysql_error());

    if ($get_count) {
        $rsp = $result->num_rows;
    } else {
        while ($row = mysqli_fetch_assoc($result)) {
            $cpms[] = $row["cpm"];
        }
        $rsp = implode(" ", $cpms);
    }

    close_database_connection($link);

    return $rsp;
}

function actionSave($_table, $session_id, $is_edit, $cpm = 0) {
    $link = open_database_connection();

    if ($is_edit) {
        $query = "
            UPDATE $_table SET `cpm`='$cpm'
            WHERE `session` = '$session_id'
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    } else {
        $query = "
            INSERT INTO $_table(`id`, `session`, `cpm`)
            VALUES(NULL, '$session_id', '$cpm')
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    }

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
