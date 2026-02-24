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
$debateid = $_SESSION['debate'];






$sqldata = mysqli_query($connection, "SELECT * FROM wormholes WHERE (srcdebate=$debateid OR dstdebate=$debateid) AND dstdebate IS NOT NULL ") or die(mysqli_error($connection));

$rows = array();
while($r = mysqli_fetch_assoc($sqldata)) {

	$srcdebate = $r['srcdebate'];
	$dstdebate = $r['dstdebate'];

	$sqldebatedata = mysqli_query($connection, "SELECT name FROM debates WHERE id!='$debateid' AND (id='$srcdebate' OR id='$dstdebate') ") or die(mysqli_error($connection));

	$debaterow = mysqli_fetch_assoc($sqldebatedata);
	$debatename = $debaterow['name'];

	$srcnode = $r['srcnode'];
	$dstnode = $r['dstnode'];

	$sqlnodedata = mysqli_query($connection, "SELECT name FROM nodes WHERE debateid!='$debateid' AND (id='$srcnode' OR id='$dstnode') ") or die(mysqli_error($connection));

	$noderow = mysqli_fetch_assoc($sqlnodedata);
	$nodename = $noderow['name'];

  $rows[] = array_merge($r,array_merge(array('debatename' => $debatename),array('nodename' => $nodename)));
}
if (mysqli_num_rows($sqldata)>0){
	echo json_encode($rows);
}
else {
	echo 'false';
}

mysqli_close($connection);
