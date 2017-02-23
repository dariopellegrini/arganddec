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
$username = $_SESSION['username'];


$id = $_POST['id'];
$name = $_POST['n']; $name = escape_apex($name);
$basevalue = $_POST['bv'];
$computedvaluequad = $_POST['cvq'];
$computedvaluedfquad = $_POST['cvdfq'];
$typevalue = $_POST['tv'];
$state = $_POST['s'];
$attachment = $_POST['a'];

$sqldebateid=mysql_query("SELECT debateid, modifiedby FROM nodes WHERE id=$id") or die(mysql_error());

while($r=mysql_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
        $modifiedby=$r['modifiedby'];
}

$pos = strpos($modifiedby, $username.' ');
$modifiedby_str = '';
// don't repeat the name of the user if it has already modified the node at least once
if($pos === false) {
    
    $modifiedby_str = $username." ".$modifiedby;
    
} else  $modifiedby_str = $modifiedby;

$sql = mysql_query("UPDATE nodes SET name='$name', basevalue='$basevalue', computedvaluequad='$computedvaluequad', computedvaluedfquad='$computedvaluedfquad', typevalue='$typevalue', state='$state', attachment='$attachment', modifiedby='$modifiedby_str' WHERE id='$id'") or die(mysql_error());

$nodeid = mysql_insert_id();

echo json_encode(array("nodeid"=>$nodeid,"modifiedby"=>$modifiedby_str));

$app_id = '104765';
$app_key = '4a093e77bfac049910cf';
$app_secret = '3525036469c1d8f547c8';

$pusher = new Pusher($app_key, $app_secret, $app_id);

$data['push'] = 'edit-node';
$data['userid']=$userid;
$data['debateid']=$debateid;
$data['nodeid']=$id;
$data['name']=$name;
$data['basevalue']=$basevalue;
$data['computedvaluequad']=$computedvaluequad;
$data['computedvaluedfquad']=$computedvaluedfquad;
$data['typevalue']=$typevalue;
$data['state']=$state;
$data['attachment']=$attachment;
$data['createdby']=$username;
$data['modifiedby']=$modifiedby_str;

$pusher->trigger('test_channel', 'my_event', $data);


// update the date of the last modified (by) of the current debate
$sql1 = mysql_query("UPDATE debates SET lastmodified=CURRENT_TIMESTAMP, lastmodifiedby='$username'  WHERE id='$debateid'");

mysql_close($connection);