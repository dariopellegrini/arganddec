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

$name = mysql_real_escape_string($_POST['n']); 
$defaultbasevalue = $_POST['dbv'];
$participants =  $_POST['p'];
$typevalue = $_POST['tv'];


$sql1 = mysql_query("Insert Into debates (ownerid,name,defaultbasevalue,participants,typevalue) Values ($userid,'$name','$defaultbasevalue','$participants','$typevalue')") or die(mysql_error());

$debateid = mysql_insert_id();
$_SESSION['debate']=$debateid;
echo mysql_insert_id();

$sql2 = mysql_query("INSERT INTO rights (userid,debateid,accessright,modified) VALUES ('$userid','$debateid','o',CURRENT_TIMESTAMP) ") or die(mysql_error());

mysql_close($connection);

?>