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

$targetid = $_POST['tid'];


$matrixid = $_POST['mid'];


$a=loadSons($targetid,$matrixid);

echo json_encode($a);




function loadSons($targetid,$matrixid){

	$added=array();
		$sql1 = mysqli_query($connection, "SELECT sourceid,targetid FROM edgesfreeze WHERE targetid='$targetid' AND matrixid='$matrixid'") or die(mysqli_error($connection));

	while($r = mysqli_fetch_assoc($sql1)) {
		$sourceid=$r['sourceid'];

		$sql2=mysqli_query($connection, "SELECT * FROM nodesfreeze WHERE originalid='$sourceid'") or die(mysqli_error($connection));

//		while($s=mysqli_fetch_array($sql2)){
			array_push($added,mysqli_fetch_object($sql2));
//		}
		array_push($added, loadSons($sourceid,$matrixid));
	}
	return $added;
}

mysqli_close($connection);

?>