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
$matrixid = $_POST['mid'];
$returntype = $_POST['rt'];

$sql1 = mysql_query("INSERT INTO mapping (userid,debateid,matrixid) VALUES ('$userid','$debateid','$matrixid')") or die(mysql_error());

if($returntype=="matrix"){
	$sql2 = mysql_query("SELECT * FROM debates WHERE id='$debateid'") or die(mysql_error());

	while($r=mysql_fetch_array($sql2)){

		echo "<li><a href='diagram.php?id=".$debateid."'><b>".$r['name']."</b></a></li>";

	}
}
else if($returntype=="debate"){
	$sql3 = mysql_query("SELECT * FROM matrices WHERE id='$matrixid'") or die(mysql_error());

	while($r=mysql_fetch_array($sql3)){

		echo "<li><a href='scores.php?id=".$matrixid."'><b>".$r['name']."</b></a></li>";

	}
}

mysql_close($connection);

?>