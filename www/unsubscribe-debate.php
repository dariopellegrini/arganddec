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

$did = $_POST['did'];


$sql1 = mysqli_query($connection, "DELETE FROM rights WHERE debateid='$did' AND userid='$userid'") or die(mysqli_error($connection));


echo mysqli_insert_id($connection);

mysqli_close($connection);
