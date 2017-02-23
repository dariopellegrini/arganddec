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


$sql1 = mysql_query("DELETE FROM rights WHERE debateid='$did' AND userid='$userid'") or die(mysql_error());


echo mysql_insert_id();

mysql_close($connection);
