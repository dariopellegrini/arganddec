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

$name = mysqli_real_escape_string($connection, $_POST['n']); 
$defaultbasevalue = $_POST['dbv'];
$participants =  $_POST['p'];
$typevalue = $_POST['tv'];


$sql1 = mysqli_query($connection, "Insert Into debates (ownerid,name,defaultbasevalue,participants,typevalue) Values ($userid,'$name','$defaultbasevalue','$participants','$typevalue')") or die(mysqli_error($connection));

$debateid = mysqli_insert_id($connection);
$_SESSION['debate']=$debateid;
echo mysqli_insert_id($connection);

$sql2 = mysqli_query($connection, "INSERT INTO rights (userid,debateid,accessright,modified) VALUES ('$userid','$debateid','o',CURRENT_TIMESTAMP) ") or die(mysqli_error($connection));

mysqli_close($connection);

?>