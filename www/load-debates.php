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



$sqldata = mysql_query("SELECT debates.id,debates.ownerid,debates.name,debates.defaultbasevalue,debates.participants,debates.typevalue,rights.accessright FROM debates LEFT JOIN rights ON debates.id=rights.debateid AND rights.userid='$userid' ORDER BY debates.name ASC") or die(mysql_error());

$rows = array();
while($r = mysql_fetch_assoc($sqldata)) {
  $rows[] = $r;
}

$json_encoded_string = json_encode($rows);

echo $json_encoded_string;


mysql_close($connection);