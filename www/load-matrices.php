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





$sql1 = mysql_query("SELECT * FROM matrices WHERE userid='$userid' ORDER BY name ASC") or die(mysql_error());

while($r=mysql_fetch_array($sql1)){

	$id = $r['id'];
	$name = $r['name'];

	echo '<div class="container matrix-container">';
	echo '<button id='.$id.' class="btn btn-default" style="width: 300px;" onClick="loadCells('.$id.')">'.$name.'</button><button class="btn btn-default" onClick="deleteMatrix('.$id.')"><span class="glyphicon glyphicon-trash"></span></button>';

	$sql2 = mysql_query("SELECT * FROM mapping WHERE userid='$userid' AND matrixid='$id'") or die(mysql_error());

	if(mysql_num_rows($sql2)>0){
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

  while($s=mysql_fetch_array($sql2)){

  	$debateid=$s['debateid'];
	$sql3 = mysql_query("SELECT * FROM debates WHERE id='$debateid'") or die(mysql_error());

	while($t=mysql_fetch_array($sql3)){
		$debatename=$t['name'];
		echo "<li><a href='diagram.php?id=".$debateid."'><b>".$debatename."</b></a></li>";
	}
  }

 echo "</ul></div>";

	echo '<br><div class="dropdown-matrix"></div>';
//	echo '<hr class="divider"></div>';
	echo '<br><br></div>';

}

mysql_close($connection);

?>