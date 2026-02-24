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


$sqldata1 = mysqli_query($connection, "SELECT users.id, users.username, rights.accessright FROM users LEFT JOIN rights "
        . "ON users.id=rights.userid AND rights.debateid='$debateid' WHERE users.id!='$userid'") or die(mysqli_error($connection));

$rows = array();
while($r = mysqli_fetch_assoc($sqldata1)) {
  $rows[] = $r;
}


echo json_encode($rows);

mysqli_close($connection);