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




$sql = mysqli_query($connection, "SELECT * FROM edgesfreeze WHERE targetid='$targetid'") or die(mysqli_error($connection));

if(mysqli_num_rows($sql)>0){
    echo 'true';
}
else{
    echo 'false';
}

mysqli_close($connection);

?>