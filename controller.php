<?php
include_once(__DIR__ . "/helper.php");
session_start();
$get_count = true;
$session_id = session_id();
$_table = "race";

$is_first = $_GET["is_first"] ? $_GET["is_first"] : false;

$cpm = $_GET["cpm"] ? $_GET["cpm"] : 0;

$action = $_GET["action"];
if ($action == "checkTable") {
    $response = actionCheckTable($_table);
    echo (int)$response;
    return;
}

if ($is_first) {
    $name = substr(md5(microtime()), 0, 4);
} else {
    $name = $_GET["name"];
    $get_count = false;
}

if (isset($cpm) && $cpm != 0) {
    $get_count = false;
    $startTimer = $_GET["startTimer"];
    $name = actionGetName($_table);
}


$result = actionCheck($_table, $session_id, $name);
$count = $result->num_rows;

if ($count == 0) {
    $is_edit = false;
    actionSave($_table, $name, $session_id, $is_edit, $cpm, $timer);
} else {
    if ($startTimer) {
        $timer = actionGetTimer($_table, $session_id);
        if ($timer != 0) {
            $timer--;
            $is_edit = true;
            actionSave($_table, $name, $session_id, $is_edit, $cpm, $timer);
        }
    }
}

$response = actionGetAll($_table, $get_count, $name);
echo $response;





function actionCheck($_table, $session_id, $name) {
    $link = open_database_connection();

    $query = "
            SELECT `id` FROM $_table
            WHERE `session_id` = '$session_id'
            ";
    $result = mysqli_query($link, $query) or die(mysqli_error());
    close_database_connection($link);

    return $result;
}

function actionGetAll($_table, $get_count, $name) {
    $link = open_database_connection();

    if ($get_count) {
        $query = "SELECT `id` FROM $_table";
        $result = mysqli_query($link, $query) or die(mysqli_error());
        $rsp = $result->num_rows;
    } else {
        $query = "SELECT `timer`, `cpm` FROM $_table WHERE `name`= '$name'";
        $result = mysqli_query($link, $query) or die(mysqli_error());
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                "cpm" => $row["cpm"],
                "timer" => $row["timer"],
            ];
        }
        $rsp = json_encode($data);
    }

    close_database_connection($link);

    return $rsp;
}

function actionSave($_table, $name, $session_id, $is_edit, $cpm, $timer) {
    $link = open_database_connection();
    if ($is_edit) {
        $query = "
            UPDATE $_table SET `cpm`='$cpm', `timer` = '$timer'
            WHERE `session_id` = '$session_id'
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    } else {
        $query = "
            INSERT INTO $_table(`id`, `name`, `session_id`, `cpm`, `timer`)
            VALUES(NULL, '$name', '$session_id', '$cpm', 60)
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    }

    close_database_connection($link);
}

?>
