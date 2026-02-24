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





$json = $_POST['table'];


if(isset($_POST['id'])){
	echo "Id setted.";
	$matrixid=$_POST['id'];

	$sql1 = mysqli_query($connection, "SELECT name FROM matrices WHERE id=$matrixid") or die(mysqli_error($connection));

while($r=mysqli_fetch_array($sql1)){
	$matrixname=$r['name'];
}

$sql1 = mysqli_query($connection, "DELETE FROM matrices WHERE id=$matrixid") or die(mysqli_error($connection));
$sql1 = mysqli_query($connection, "DELETE FROM cells WHERE matrixid=$matrixid") or die(mysqli_error($connection));

$sql1 = mysqli_query($connection, "INSERT INTO matrices (id,name,userid) VALUES ($matrixid,'$matrixname','$userid')") or die(mysqli_error($connection));

}
else{
	$matrixname = $_POST['name'];

	$sql1 = mysqli_query($connection, "INSERT INTO matrices (name,userid) VALUES ('$matrixname','$userid')") or die(mysqli_error($connection));

	$matrixid = mysqli_insert_id($connection);

	echo '<div class="container matrix-container">';
	echo '<button id="'.$matrixid.'" class="btn btn-default" style="width: 300px;" onClick="loadCells('.$matrixid.')">'.$matrixname.'</button><button class="btn btn-default" onClick="deleteMatrix('.$matrixid.')"><span class="glyphicon glyphicon-trash"></span></button><br><div class="dropdown-matrix"></div>';
	echo '<hr class="divider"></div>';

}

	$rowCount = 0;
foreach ($json as $rkey => $row) {

	if($rkey==0){
		$type='variant';
	}

	foreach ($row as $ckey => $el){
		if($rkey!=0){
			$type='cell';
		if($ckey==0){
			$type = 'criteria';
		}
		}


		$label = $el['label'];
		$value = $el['value'];
		$ref = $el['ref'];


		$sql2 = mysqli_query($connection, "INSERT INTO `cells` (`id`, `matrixid`, `type`, `label`, `value`, `row`, `column`, `creation`) VALUES (NULL, '$matrixid', '$type', '$label', '$value', '$rkey', '$ckey', CURRENT_TIMESTAMP);") or die(mysqli_error($connection));

	}

}

mysqli_close($connection);

?>