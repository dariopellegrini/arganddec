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






$sqldata = mysql_query("SELECT * FROM nodes WHERE debateid = $debateid ORDER BY type ASC") or die();

$rows = array();
while($r = mysql_fetch_assoc($sqldata)) {
  $rows[] = $r;
}

$json_encoded_string = json_encode($rows);

// manage percent symbol for json encoding
$json_encoded_string = escape_percentage_for_json($json_encoded_string);

echo $json_encoded_string;

mysql_close($connection);