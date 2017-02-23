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


$debateid = $_POST['did'];



$name = $_POST['n'];
$basevalue = $_POST['bv'];
$computedvalue = $_POST['cv'];
$type = $_POST['t'];
$typevalue = $_POST['tv'];
$state = $_POST['s'];
$attachment = $_POST['a'];
$x = $_POST['x'];
$y = $_POST['y'];


$sql = mysql_query("Insert Into nodes (debateid, name, basevalue, computedvalue, type, typevalue, state, attachment, x, y) Values ($debateid, '$name', '$basevalue', '$computedvalue', '$type', '$typevalue', '$state', '$attachment', '$x', '$y')") or die(mysql_error());

$nodeid=mysql_insert_id();

echo $nodeid;

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push'] = 'add-node';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['nodeid']=$nodeid;
$data['name']=$name;
$data['basevalue']=$basevalue;
$data['computedvalue']=$computedvalue;
$data['type']=$type;
$data['typevalue']=$typevalue;
$data['state']=$state;
$data['attachment']=$attachment;
$data['x']=$x;
$data['y']=$y;



$pusher->trigger('test_channel', 'my_event', $data);

mysql_close($connection);
