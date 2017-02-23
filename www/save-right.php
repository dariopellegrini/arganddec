<?php

include 'dbUtilities.php';

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id'])) {
	echo "Your session expired...";
	die();
}

$userid = $_POST['uid'];
$debateid = $_POST['did'];
$right = $_POST['r'];



$sql1 = mysql_query("SELECT * FROM rights WHERE userid='$userid' AND debateid='$debateid'") or die(mysql_error());
if($right!=''){
    if (mysql_num_rows($sql1)>0){
            $sql2 = mysql_query("UPDATE rights SET accessright='$right',modified=CURRENT_TIMESTAMP WHERE userid='$userid' AND debateid='$debateid'") or die(mysql_error());
    }
    else {
            $sql2 = mysql_query("INSERT INTO rights (userid,debateid,accessright,modified) VALUES ('$userid','$debateid','$right',CURRENT_TIMESTAMP)") or die(mysql_error());
    }
}
else {
    $sql3 = mysql_query("DELETE FROM rights WHERE userid='$userid' AND debateid='$debateid'") or die(mysql_error());
}

echo 'OK!';

mysql_close($connection);