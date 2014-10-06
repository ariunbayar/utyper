<?php
session_start();
$get_count = true;
$session_id = session_id();
$cpm = $_GET["cpm"];
$status = (int)$_GET["status"];
$check_stat = $_GET["check_stat"] ? (int)$_GET["check_stat"] : 2;
// status 1 - ready
// status 2 - waiting
// status 3 - playing
$_table = "u_users";

if (isset($cpm)) $get_count = false;

if (isset($session_id)) {
    // Check session id
    $result = actionCheck($session_id, $_table);
    $count = $result->num_rows;

    if ($count == 0) {
        $is_edit = false;
        actionSave($_table, $session_id, $is_edit, $cpm, $status);
    } else {
        $is_edit = true;
        actionSave($_table, $session_id, $is_edit, $cpm, $status);
    }

    $response = actionGetAll($_table, $get_count, $check_stat);
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


function actionGetAll($_table, $get_count, $check_stat) {
    $link = open_database_connection();
    if ($get_count) {
        $query = "SELECT `id` FROM $_table WHERE `status`= '$check_stat'";
        $result = mysqli_query($link, $query) or die(mysql_error());
        $rsp = $result->num_rows;
    } else {
        $query = "SELECT `cpm` FROM $_table WHERE `status`= 3";
        $result = mysqli_query($link, $query) or die(mysql_error());
        while ($row = mysqli_fetch_assoc($result)) {
            $cpms[] = $row["cpm"];
        }
        $rsp = implode(" ", $cpms);
    }

    close_database_connection($link);

    return $rsp;
}

function actionSave($_table, $session_id, $is_edit, $cpm = 0, $status) {
    $link = open_database_connection();
    if ($is_edit) {
        if ($status != 0) {
            $query = "
                UPDATE $_table SET `status`='$status'
                WHERE `session` = '$session_id'
            ";
            $result = mysqli_query($link, $query) or die(mysql_error());
        }
        if ($cpm !=0) {
            $query = "
                UPDATE $_table SET `cpm`='$cpm'
                WHERE `session` = '$session_id'
            ";
            $result = mysqli_query($link, $query) or die(mysql_error());
        }
    } else {
        $query = "
            INSERT INTO $_table(`id`, `session`, `cpm`, `status`)
            VALUES(NULL, '$session_id', '$cpm', '$status')
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
