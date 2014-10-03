<?php
session_start();
$creator = session_id();
$topic = $_GET["topic"];
$countdown = $_GET["countdown"];
$follower = $_GET["follower"];
$getCountdownAndTopic = $_GET["getCountdownAndTopic"];
$_table = "u_race";


if (isset($creator) && isset($topic) && isset($countdown) && isset($follower)) {
    // Check session id
    $followers = actionCheck($_table, $creator);

    if (isset($followers) && $followers < 5) {
        $is_edit = true;
        actionSave($_table, $creator, $topic, $is_edit, $countdown, $follower);
    } else {
        $is_edit = false;
        actionSave($_table, $creator, $topic, $is_edit, $countdown, $follower);
    }
}

if (isset($getCountdownAndTopic)) {
    // Get countdown and topic
    $response = actionGet($_table);
    echo $response;
}

function actionGet($_table) {
    $link = open_database_connection();
    $query = "
            SELECT `countdown`, `topic`  FROM $_table
            WHERE `follower` < 2
            ";
    $result = mysqli_query($link, $query) or die(mysql_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["countdown"] . " " . $row["topic"];
    close_database_connection($link);

    return $rsp;
}

function actionCheck($_table, $creator) {
    $link = open_database_connection();
    $query = "
            SELECT `follower` FROM $_table
            WHERE `creator` = '$creator'
            ";
    $result = mysqli_query($link, $query) or die(mysql_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["follower"];
    close_database_connection($link);

    return $rsp;
}

function actionSave($_table, $creator, $topic, $is_edit, $countdown, $follower) {
    $link = open_database_connection();

    if ($is_edit) {
        $query = "
            UPDATE $_table SET `topic`='$topic', `countdown`='$countdown', `follower`='$follower'
            WHERE `creator` = '$creator'
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    } else {
        $query = "
            INSERT INTO $_table(`id`, `creator`, `topic`, `countdown`, `follower`)
            VALUES(NULL, '$creator', '$topic', '$countdown', '$follower')
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
