<?php
include_once(__DIR__ . "/helper.php");

$_table ="countdown";
$action = $_GET["action"];
$topic = (int)$_GET["topic"];

if ($action != 3) actionUpdate($_table, $action, $topic);

$response = actionGet($_table);
echo $response;

function actionUpdate($_table, $action, $topic) {
    $link = open_database_connection();

    if ($action == 1) {
        if ($topic != -1) {
            $countdown = 30;
            $name = actionGetName("race");
            $query = "
                    INSERT INTO $_table(`id`, `time`, `name`, `topic`)
                    VALUES(NULL, '$countdown', '$name', '$topic')
                    ";
        }
    } else if ($action == 2) {
        $countdown = actionGet($_table) - 1;
        $query = "UPDATE $_table SET `time` = $countdown";
    }
    $result = mysqli_query($link, $query) or die(mysqli_error());


    close_database_connection($link);
}

function actionGet($_table) {
    $link = open_database_connection();

    $query = "SELECT `time`, `name`, `topic` FROM $_table ORDER BY `id` DESC LIMIT 1";
    $result = mysqli_query($link, $query) or die(mysqli_error());
    $row = mysqli_fetch_assoc($result);
    $rsp = $row["time"] . " " . $row["name"] . " " . $row["topic"];

    close_database_connection($link);
    return $rsp;
}

?>
