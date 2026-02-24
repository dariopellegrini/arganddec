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
$id = $_POST['id'];

$sqldebateid=mysqli_query($connection, "SELECT debateid FROM nodes WHERE id=$id") or die(mysqli_error($connection));

while($r=mysqli_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
}

$sql1 = mysqli_query($connection, "DELETE FROM nodes WHERE id=$id") or die(mysqli_error($connection));

$sql2 = mysqli_query($connection, "DELETE FROM edges WHERE (sourceid=$id OR targetid=$id)") or die(mysqli_error($connection));

$sql3 = mysqli_query($connection, "DELETE FROM wormholes WHERE (srcnode=$id OR dstnode=$id)") or die(mysqli_error($connection));

echo mysqli_insert_id($connection);

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push'] = 'delete-node';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['nodeid']=$id;

$pusher->trigger('test_channel', 'my_event', $data);

mysqli_close($connection);
