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




$id = $_POST['id'];


$sql1 = mysqli_query($connection, "DELETE FROM debates WHERE id=$id AND ownerid='$userid'") or die(mysqli_error($connection));
$sql2 = mysqli_query($connection, "DELETE FROM nodes WHERE debateid=$id") or die(mysqli_error($connection));
$sql3 = mysqli_query($connection, "DELETE FROM edges WHERE debateid=$id") or die(mysqli_error($connection));
$sql4 = mysqli_query($connection, "DELETE FROM rights WHERE debateid='$id'") or die (mysqli_error($connection));
$sql5 = mysqli_query($connection, "DELETE FROM mapping WHERE debateid='$debateid'") or die(mysqli_error($connection));

echo mysqli_insert_id($connection);

mysqli_close($connection);
