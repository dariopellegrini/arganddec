<?php

include 'dbUtilities.php';
require('Pusher.php');

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id']) || !isset($_SESSION['debate'])) {
	echo "Your session expired...";
	die();
}



$userid = $_SESSION['id'];
$debateid = $_POST['did'];




$sourceid = $_POST['s'];
$targetid = $_POST['t'];


$sql = mysql_query("Insert Into edges (debateid,sourceid,targetid) Values ('$debateid','$sourceid','$targetid')") or die(mysql_error());

$edgeid=mysql_insert_id();
echo $edgeid;



$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push']='add-edge';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['edgeid']=$edgeid;
$data['sourceid']=$sourceid;
$data['targetid']=$targetid;



$pusher->trigger('test_channel', 'my_event', $data);

mysql_close($connection);