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
$type = $_POST['type'];

$sqldebateid=mysql_query("SELECT debateid, state, modifiedby FROM nodes WHERE id=$id") or die(mysql_error());

while($r=mysql_fetch_array($sqldebateid)){
	$debateid=$r['debateid'];
        $state=$r['state'];
        $modifiedby=$r['modifiedby'];
}

if($state==='Basic') {
    $pos = strpos($modifiedby, $username.' ');
    $modifiedby_str = '';
    // don't repeat the name of the user if it has already modified the node at least once
    if($pos === false) {

        $modifiedby_str = $username." ".$modifiedby;

    } else  $modifiedby_str = $modifiedby;

    $sql = mysql_query("UPDATE nodes SET type='$type', modifiedby='$modifiedby_str' WHERE id=$id") or die(mysql_error());

    echo mysql_insert_id();

    $app_id = '104765';
    $app_key = '4a093e77bfac049910cf';
    $app_secret = '3525036469c1d8f547c8';

    $pusher = new Pusher($app_key, $app_secret, $app_id);

    $data['push']='edit-node-type';
    $data['userid']=$userid;
    $data['debateid']=$debateid;
    $data['nodeid']=$id;
    $data['type']=$type;
    $data['modifiedby']=$modifiedby_str;

    $pusher->trigger('test_channel', 'my_event', $data);

    // update the date of the last modified (by) of the current debate
    $sql1 = mysql_query("UPDATE debates SET lastmodified=CURRENT_TIMESTAMP, lastmodifiedby='$username'  WHERE id='$debateid'");
}
else {
    $res['success']=0;
    echo json_encode($res);
}

mysql_close($connection);