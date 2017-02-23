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

$sqldebateid=mysql_query("SELECT debateid FROM nodes WHERE id=$id") or die(mysql_error());

while($r=mysql_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
}

$sql1 = mysql_query("DELETE FROM nodes WHERE id=$id") or die(mysql_error());

$sql2 = mysql_query("DELETE FROM edges WHERE (sourceid=$id OR targetid=$id)") or die(mysql_error());

$sql3 = mysql_query("DELETE FROM wormholes WHERE (srcnode=$id OR dstnode=$id)") or die(mysql_error());

echo mysql_insert_id();

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push'] = 'delete-node';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['nodeid']=$id;

$pusher->trigger('test_channel', 'my_event', $data);

mysql_close($connection);
