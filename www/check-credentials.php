<?php
	ob_start();
	include "dbUtilities.php";
	session_start();

	// Special characters.	
	$username = changeChar($_POST['username']);
	$password = $_POST['password'];


	// Se il controllo va bene si effettua il login e si ritorna una stringa OK, altrimenti errore.
	$id = checkCredential($username,$password);
	if($id!=false){
		echo "OK";
		$_SESSION['login']=true;
		$_SESSION['id']=$id;
		$_SESSION['username']=$username;
		
		}
		else echo "Error. Wrong username and/or <a onClick='pong()'>password</a>."

?>