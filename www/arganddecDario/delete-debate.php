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


$sql1 = mysql_query("DELETE FROM debates WHERE id=$id AND ownerid='$userid'") or die(mysql_error());
$sql2 = mysql_query("DELETE FROM nodes WHERE debateid=$id") or die(mysql_error());
$sql3 = mysql_query("DELETE FROM edges WHERE debateid=$id") or die(mysql_error());
$sql4 = mysql_query("DELETE FROM mapping WHERE debateid='$debateid'") or die(mysql_error());

echo mysql_insert_id();

mysql_close($connection);
