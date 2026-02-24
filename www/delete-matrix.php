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

$userid = $_SESSION['id'];



$matrixid = $_POST['id'];

$sql1 = mysqli_query($connection, "DELETE FROM matrices WHERE id='$matrixid'") or die(mysqli_error($connection));

$sql2 = mysqli_query($connection, "DELETE FROM cells WHERE matrixid='$matrixid'") or die(mysqli_error($connection));

$sql3 = mysqli_query($connection, "DELETE FROM mapping WHERE matrixid='$matrixid'") or die(mysqli_error($connection));

$sql4 = mysqli_query($connection, "DELETE FROM nodesfreeze WHERE matrixid='$matrixid'") or die(mysqli_error($connection));

$sql5 = mysqli_query($connection, "DELETE FROM edgesfreeze WHERE matrixid='$matrixid'") or die(mysqli_error($connection));

echo "ok";


mysqli_close($connection);

?>