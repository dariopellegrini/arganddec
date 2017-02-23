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



$userid=$_SESSION['id'];
$targetid = $_POST['tid'];




$sql = mysql_query("SELECT * FROM edgesfreeze WHERE targetid='$targetid'") or die(mysql_error());

if(mysql_num_rows($sql)>0){
    echo 'true';
}
else{
    echo 'false';
}

mysql_close($connection);

?>