<?php
	include "dbUtilities.php";
	$session_expiration = time() + 3600 * 24 * 2; // +2 days
	session_set_cookie_params($session_expiration);
	session_start();
	
	$username = htmlentities(changeChar($_POST['username']));
	$email = htmlentities($_POST['email']);
	$password = htmlentities($_POST['password']);
	$expertise = htmlentities($_POST['expertise']);
	
	if($username=="") header("Location: index.php"); // Se username è vuoto reindirizza a index.php.
	else
	
	if(checkUserInDB($username)==true) echo "This username already exists.";
		else if(checkEMailInDB(strtolower($email))==true) echo "This e-mail already exists.";
			else{
		
			

			$id = insertUser($username, $email, $password, $expertise);
			
			// Una volta effettuata la registrazione la sessione viene avviata.
			
			$_SESSION['id']=$id;
			$_SESSION['login']=true;
			$_SESSION["username"]=$username;
			echo "Utente ".$username." aggiunto con successo.";
		}
		
	//sostituisco le lettere accentate con le relativa entità html
?>