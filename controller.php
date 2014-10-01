<?php
$time = time();
$check_time = $time - 3; // 600 = 10 min
$session_id = $_GET["phpsessid"];
$cpm = isset($_GET["cpm"]) ? $_GET["cpm"] : 1;
$cnt = $_GET["count"] ? $_GET["count"] : false;
$getSession = $_GET["getSession"] ? $_GET["getSession"] : false;
$last_cpm = $_GET["last_cpm"];
$_table = "u_online_users";

if (isset($session_id) && isset($cpm)) {
    // Check session id
    $result = actionCheck($session_id, $_table);
    $count = $result->num_rows;

    if ($count == 0) {
        $is_edit = false;
        actionSave($_table, $session_id, $time, $is_edit, $cpm);
    } else {
        if ($cpm != 1) {
            $is_edit = true;
            actionSave($_table, $session_id, $time, $is_edit, $cpm);
        }
    }

    // delete session if time over
    actionDelete($_table, $check_time);

    $response = actionGetAll($_table, $cnt, $session_id, $getSession);
    echo $response;
}

function actionGetAll($_table, $cnt, $session_id, $getSession) {
    $link = open_database_connection();

    $query1 = "SELECT * FROM $_table";
    $query2 = "SELECT cpm FROM $_table ORDER BY id DESC";
    $query3 = "SELECT `session` FROM $_table WHERE NOT `session`='$session_id'";

    if ($getSession) {
        $result = mysqli_query($link, $query3) or die(mysql_error());
        $row = mysqli_fetch_assoc($result);
        $rsp = $row["session"];
    } elseif ($cnt) {
        $result = mysqli_query($link, $query1) or die(mysql_error());
        $rsp = $result->num_rows;
    } else {
        $result = mysqli_query($link, $query2) or die(mysql_error());
        while ($row = mysqli_fetch_assoc($result)) {
            $cpms[] = $row["cpm"];
        }
        $rsp = implode(" ", $cpms);
    }
    close_database_connection($link);

    return $rsp;
}

function actionCheck($session_id, $_table) {
    $link = open_database_connection();
    $query = "
            SELECT * FROM $_table
            WHERE session = '$session_id'
            ";
    $result = mysqli_query($link, $query) or die(mysql_error());
    close_database_connection($link);

    return $result;
}

function actionSave($_table, $session_id, $time, $is_edit, $cpm) {
    $link = open_database_connection();

    if ($is_edit) {
        $query = "
            UPDATE $_table SET time='$time', cpm='$cpm'
            WHERE session = '$session_id'
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    } else {
        $query = "
            INSERT INTO $_table(id, session, time, cpm)
            VALUES(NULL, '$session_id', '$time', '$cpm')
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    }

    close_database_connection($link);
}

function actionDelete($_table, $check_time) {
    $link = open_database_connection();

    $query = "
        DELETE FROM $_table
        WHERE time < $check_time
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
