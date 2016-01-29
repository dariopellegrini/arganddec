<?php

include 'dbUtilities.php';

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id']) or !isset($_SESSION['debate'])) {
	echo "Your session expired...";
	die();
}

$userid = $_SESSION['id'];

if (!isset($_POST['did'])){


$debateid = $_SESSION['debate'];
}
else {
	$debateid = $_POST['did'];
}

$matrixid=$_POST['matrixid'];

$jsonNodes = $_POST['nodes'];
foreach ($jsonNodes as $el) {


	$originalid=$el['originalid'];
	$name=$el['name'];
	$basevalue=$el['basevalue'];
	$computedvalue=$el['computedvalue'];
	$type=$el['type'];
	$typevalue=$el['typevalue'];
	$state=$el['state'];
	$attachment=$el['attachment'];

	$sql=mysql_query("INSERT INTO nodesfreeze (originalid,matrixid,debateid,name,basevalue,computedvalue,type,typevalue,state,attachment) VALUES ('$originalid','$matrixid','$debateid','$name','$basevalue','$computedvalue','$type','$typeValue','$state','$attachment')") or die(mysql_error());

}

$jsonEdges = $_POST['edges'];
foreach ($jsonEdges as $el) {


	$originalid=$el['originalid'];
	$sourceid=$el['sourceid'];
	$targetid=$el['targetid'];
	$value=$el['value'];

	$sql=mysql_query("INSERT INTO edgesfreeze (originalid,matrixid,debateid,sourceid,targetid,value) VALUES ('$originalid','$matrixid','$debateid','$sourceid','$targetid','$value')") or die(mysql_error());

}

mysql_close($connection);

?>