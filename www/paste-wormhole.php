<?php

include 'dbUtilities.php';
require('Pusher.php');

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id'])) {
	echo "Your session expired...";
	die();
}




$userid = $_SESSION['id'];
$dstdebate = $_POST['did'];
$dstnode = $_POST['dn'];


// Recover srcdebate and src node of the copied wormhole.
$sqluser = mysqli_query($connection, "SELECT * FROM wormholes WHERE userid='$userid'") or die(mysqli_error($connection));
$sql1 = mysqli_query($connection, "SELECT * FROM wormholes WHERE dstdebate IS NULL AND dstnode IS NULL") or die(mysqli_error($connection));

// Check if copied value exists.
if (mysqli_num_rows($sqluser)<=0 or mysqli_num_rows($sql1)<=0){
	echo "ALERT: trying to paste a non copied wormhole.";
	die();
}

while ($r=mysqli_fetch_array($sql1)){
	$srcdebate = $r['srcdebate'];
	$srcnode = $r['srcnode'];
}

// Check source and destination debate, because wormholes have sense only between differemt debates.

if ($srcdebate == $dstdebate){
	echo "ALERT: the wormhole can't connect two node of the same room.";
	die();
}

// Check the existence of a possible duplication of a wormhole and avoid it.
$sql2 = mysqli_query($connection, "SELECT * FROM wormholes WHERE (srcnode='$srcnode' AND dstnode='$dstnode') OR (srcnode='$dstnode' AND dstnode='$srcnode')" )  or die(mysqli_error($connection));

if (mysqli_num_rows($sql2)>0){
	echo "ALERT : this wormole already exists in the database.";
	die();
}

$sql3 = mysqli_query($connection, "UPDATE wormholes SET dstdebate='$dstdebate', dstnode='$dstnode' WHERE userid='$userid' AND dstdebate IS NULL AND dstnode IS NULL") or die(mysqli_error($connection));

$sql4 = mysqli_query($connection, "SELECT * FROM debates WHERE id='$srcdebate'") or die(mysqli_error($connection));

$rows = array();

while($r = mysqli_fetch_assoc($sql4)) {
	$sql5 = mysqli_query($connection, "SELECT name FROM nodes WHERE id='$srcnode' ") or die(mysqli_error($connection));
	$noderow = mysqli_fetch_assoc($sql5);
	$srcnodename = $noderow['name'];
  $rows[] = array_merge($r,array_merge(array('srcnode' => $srcnode),array('srcnodename' => $srcnodename)));
}

$encodedrows=json_encode($rows);
echo $encodedrows;

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push']='paste-wormhole';
$data['userid']=$userid;
$data['debateid']=$dstdebate;
$data['dstnode']=$dstnode;
$data['json']=$encodedrows;

$pusher->trigger('test_channel', 'my_event', $data);

mysqli_close($connection);

//	echo $srcdebate;
