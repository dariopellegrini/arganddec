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



$matrixid = $_POST['id'];

$sql1 = mysql_query("DELETE FROM matrices WHERE id='$matrixid'") or die(mysql_error());

$sql2 = mysql_query("DELETE FROM cells WHERE matrixid='$matrixid'") or die(mysql_error());

$sql3 = mysql_query("DELETE FROM mapping WHERE matrixid='$matrixid'") or die(mysql_error());

$sql4 = mysql_query("DELETE FROM nodesfreeze WHERE matrixid='$matrixid'") or die(mysql_error());

$sql5 = mysql_query("DELETE FROM edgesfreeze WHERE matrixid='$matrixid'") or die(mysql_error());

echo "ok";


mysql_close($connection);

?>