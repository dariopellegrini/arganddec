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
$createdby = $_SESSION['username'];

$debateid = $_POST['did'];

$name = mysql_real_escape_string($_POST['n']); 
$basevalue = $_POST['bv'];
$computedvaluequad = $_POST['cvq'];
$computedvaluedfquad = $_POST['cvdfq'];
$type = $_POST['t'];
$typevalue = $_POST['tv'];
$state = $_POST['s'];
$attachment = $_POST['a'];
$x = $_POST['x'];
$y = $_POST['y'];


$sql = mysql_query("Insert Into nodes (debateid, name, basevalue, computedvaluequad, computedvaluedfquad, type, typevalue, state, attachment, x, y, createdby) Values ($debateid, '$name', '$basevalue', '$computedvaluequad','$computedvaluedfquad','$type', '$typevalue', '$state', '$attachment', '$x', '$y', '$createdby')") or die(mysql_error());

$nodeid=mysql_insert_id();

echo json_encode(array("nodeid"=>$nodeid,"createdby"=>$createdby));

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
$data['computedvaluequad']=$computedvaluequad;
$data['computedvaluedfquad']=$computedvaluedfquad;
$data['type']=$type;
$data['typevalue']=$typevalue;
$data['state']=$state;
$data['attachment']=$attachment;
$data['x']=$x;
$data['y']=$y;
$data['createdby']=$createdby;
$data['modifiedby']='';



$pusher->trigger('test_channel', 'my_event', $data);


// update lastmodified(by) in debates
$sql1 = mysql_query("UPDATE debates SET lastmodified=CURRENT_TIMESTAMP, lastmodifiedby='$createdby'  WHERE id='$debateid'");

mysql_close($connection);
