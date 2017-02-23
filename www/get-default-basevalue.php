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


$debateid = $_POST['did'];

$sql = mysql_query("SELECT defaultbasevalue FROM debates WHERE id='$debateid'") or die(mysql_error());

$row = mysql_fetch_array($sql);
$result['basevalue']=$row['defaultbasevalue'];

echo json_encode($result);

mysql_close($connection);