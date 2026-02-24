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



$sql1 = mysqli_query($connection, "SELECT * FROM rights WHERE userid='$userid' AND debateid='$debateid'") or die(mysqli_error($connection));
if($right!=''){
    if (mysqli_num_rows($sql1)>0){
            $sql2 = mysqli_query($connection, "UPDATE rights SET accessright='$right',modified=CURRENT_TIMESTAMP WHERE userid='$userid' AND debateid='$debateid'") or die(mysqli_error($connection));
    }
    else {
            $sql2 = mysqli_query($connection, "INSERT INTO rights (userid,debateid,accessright,modified) VALUES ('$userid','$debateid','$right',CURRENT_TIMESTAMP)") or die(mysqli_error($connection));
    }
}
else {
    $sql3 = mysqli_query($connection, "DELETE FROM rights WHERE userid='$userid' AND debateid='$debateid'") or die(mysqli_error($connection));
}

echo 'OK!';

mysqli_close($connection);