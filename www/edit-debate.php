<?php

include 'dbUtilities.php';

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id'])) {
	echo "Your session expired...";
	die();
}

$userid = $_SESSION['id'];
$username = $_SESSION['username'];



$id = $_POST['id'];
$name = $_POST['n'];
$defaultBaseValue = $_POST['dbv'];
$participants = $_POST['p'];
$typeValue = $_POST['tv'];


$sql = mysqli_query($connection, "UPDATE debates SET name='$name', defaultbasevalue='$defaultBaseValue', participants='$participants', typevalue='$typeValue' WHERE id=$id") or die(mysqli_error($connection));

echo mysqli_insert_id($connection);

// update lastmodified(by) in debates
$sql1 = mysqli_query($connection, "UPDATE debates SET lastmodified=CURRENT_TIMESTAMP, lastmodifiedby='$username'  WHERE id='$id'");

mysqli_close($connection);