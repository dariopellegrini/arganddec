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
$debateid = $_POST['did'];








$sqldata1 = mysql_query("SELECT users.id, users.username, rights.accessright FROM users LEFT JOIN rights ON users.id=rights.userid AND rights.debateid='$debateid' WHERE users.id!='$userid'") or die(mysql_error());

$rows = array();
while($r = mysql_fetch_assoc($sqldata1)) {
  $rows[] = $r;
}


echo json_encode($rows);

mysql_close($connection);