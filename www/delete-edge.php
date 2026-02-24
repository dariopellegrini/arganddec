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

$sqldebateid=mysqli_query($connection, "SELECT debateid FROM edges WHERE id=$id") or die(mysqli_error($connection));

while($r=mysqli_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
}

$sql = mysqli_query($connection, "DELETE FROM edges WHERE id=$id") or die(mysqli_error($connection));

echo mysqli_insert_id($connection);

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push'] = 'delete-edge';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['edgeid']=$id;

$pusher->trigger('test_channel', 'my_event', $data);

mysqli_close($connection);
