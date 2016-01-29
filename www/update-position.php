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

$nodeid = $_POST['id'];
$x = $_POST['x'];
$y = $_POST['y'];

$sqldebateid=mysql_query("SELECT debateid FROM nodes WHERE id=$nodeid") or die(mysql_error());

while($r=mysql_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
}

$sql = mysql_query("UPDATE nodes SET x='$x', y='$y' WHERE id='$nodeid' ") or die(mysql_error());

echo mysql_insert_id();
/*
$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push']='update-position';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['nodeid']=$nodeid;
$data['x']=$x;
$data['y']=$y;

$pusher->trigger('test_channel', 'my_event', $data);
*/
mysql_close($connection);