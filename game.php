<?php
$creator = $_GET["phpsessid"];
$topic = $_GET["topic"];
$countdown = $_GET["countdown"];
$follower = $_GET["follower"] ? $_GET["follower"] : 0;
$_table = "u_game";
$getCountdown = $_GET["getCountdown"] ? $_GET["getCountdown"] : false;

if (isset($creator) && isset($topic) && isset($countdown)) {
    // Check session id
    $result = actionCheck($creator, $_table);
    $count = $result->num_rows;

    if ($count == 0) {
        $is_edit = false;
        actionSave($_table, $creator, $topic, $is_edit, $countdown);
    } else {
        $is_edit = true;
        actionSave($_table, $creator, $topic, $is_edit, $countdown, $follower);
    }

    // TODO: delete row if follower reaches 3
    //actionDelete($_table, $creator);

    // Get followers and countdown
    $response = actionGet($_table, $creator);
    echo $response;
}

if ($getCountdown) {
    $response = actionGet($_table, $creator);
    echo $response;
}


function actionGet($_table, $creator) {
    $link = open_database_connection();

    $query = "SELECT topic, follower, countdown FROM $_table WHERE creator='$creator'";
    $result = mysqli_query($link, $query) or die(mysql_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["topic"] . " " . $row["follower"] . " " . $row["countdown"];
    close_database_connection($link);

    return $rsp;
}

function actionCheck($creator = null, $_table) {
    $link = open_database_connection();
    if ($creator == null) {
        $query = "
                SELECT * FROM $_table
                ORDER BY `id` DESC
                LIMIT 1
                ";
    } else {
        $query = "
                SELECT * FROM $_table
                WHERE creator = '$creator'
                ";
    }
    $result = mysqli_query($link, $query) or die(mysql_error());
    close_database_connection($link);

    return $result;
}

function actionSave($_table, $creator, $topic, $is_edit, $countdown, $follower = 0) {
    $link = open_database_connection();

    if ($is_edit) {
        $query = "
            UPDATE $_table SET topic='$topic', countdown='$countdown', follower='$follower'
            WHERE creator = '$creator'
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    } else {
        $query = "
            INSERT INTO $_table(id, creator, topic, countdown, follower)
            VALUES(NULL, '$creator', '$topic', '$countdown', '$follower')
        ";
        $result = mysqli_query($link, $query) or die(mysql_error());
    }

    close_database_connection($link);
}

function actionDelete($_table, $creator) {
    $link = open_database_connection();

    $query = "
        DELETE FROM $_table
        WHERE creator = '$creator'
    ";
    $result = mysqli_query($link, $query) or die(mysql_error());

    close_database_connection($link);
}
function actionGetFollower($_table, $creator) {
    $link = open_database_connection();
    $query = "
            SELECT `follower`  FROM $_table
            WHERE `creator` = '$creator'
            ";
    $result = mysqli_query($link, $query) or die(mysql_error());
    $row = mysqli_fetch_assoc($result);
    $followers = (int)$row["follower"];
    close_database_connection($link);

    return $followers;
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

