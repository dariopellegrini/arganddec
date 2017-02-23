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


$srcdebate = $_POST['did'];


$srcnode = $_POST['sn'];

$sql1 = mysql_query("DELETE FROM `wormholes` WHERE userid='$userid' AND dstdebate IS NULL AND dstnode IS NULL") or die(mysql_error());
$sql2 = mysql_query("INSERT INTO `wormholes` (`userid`, `srcdebate`, `dstdebate`, `srcnode`, `dstnode`) VALUES ('$userid', '$srcdebate', NULL, '$srcnode', NULL);") or die(mysql_error());

if ($sql2){
	echo "Wormhole node copied.";
}
else {
	echo "Something went wrong.";
}

mysql_close($connection);
