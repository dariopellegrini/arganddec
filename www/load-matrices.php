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





$sql1 = mysqli_query($connection, "SELECT * FROM matrices WHERE userid='$userid' ORDER BY name ASC") or die(mysqli_error($connection));

while($r=mysqli_fetch_array($sql1)){

	$id = $r['id'];
	$name = $r['name'];

	echo '<div class="container matrix-container">';
	echo '<button id='.$id.' class="btn btn-default" style="width: 300px;" onClick="loadCells('.$id.')">'.$name.'</button><button class="btn btn-default" onClick="deleteMatrix('.$id.')"><span class="glyphicon glyphicon-trash"></span></button>';

	$sql2 = mysqli_query($connection, "SELECT * FROM mapping WHERE userid='$userid' AND matrixid='$id'") or die(mysqli_error($connection));

	if(mysqli_num_rows($sql2)>0){
		echo "<div class='btn-group mapped-graphs-list'>";
	}
	else{
		echo "<div class='btn-group mapped-graphs-list' style='display:none'>";
	}

	echo "
  <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>
    <span class='glyphicon glyphicon-share'></span>
  </button>
  <ul class='dropdown-menu' role='menu'>";

  while($s=mysqli_fetch_array($sql2)){

  	$debateid=$s['debateid'];
	$sql3 = mysqli_query($connection, "SELECT * FROM debates WHERE id='$debateid'") or die(mysqli_error($connection));

	while($t=mysqli_fetch_array($sql3)){
		$debatename=$t['name'];
		echo "<li><a href='diagram.php?id=".$debateid."'><b>".$debatename."</b></a></li>";
	}
  }

 echo "</ul></div>";

	echo '<br><div class="dropdown-matrix"></div>';
//	echo '<hr class="divider"></div>';
	echo '<br><br></div>';

}

mysqli_close($connection);

?>