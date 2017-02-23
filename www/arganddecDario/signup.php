<?php
	$session_expiration = time() + 3600 * 24 * 2; // +2 days
	session_set_cookie_params($session_expiration);
	session_start();
	if(isset($_SESSION['id'])){
			header("Location: index.php");
		}
?>
<html>
	<head>
		<title>Sign up</title>
        <script src="js/jquery-1.11.1.js"></script>
        <script src="js/go-debug.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
        <script src="jsPlumb-master/dist/js/dom.jsPlumb-1.6.4.js"></script>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <!-- Latest compiled and minified JavaScript -->
        <script src="js/bootstrap.min.js"></script>
        <script src="js/bootbox.min.js"></script>

        <script src="js/signup.js"></script>
	</head>
	
	<body>
	<h1 class="container" id="user-inserted" hidden="true">Success!</h1>
	
		<div id="signup-container" class="container">
			
			<h1> Sign up </h1><br>
			
			<label>Username: </label><br>
			<input type="text" id="username"/><div class="error" id="username-error"></div><br>

			<label>E-mail: </label><br>
			<input type="text" id="email"></input><div class="error" id="email-error"></div><br>

			<label>Password: </label><br>
			<input type="password" id="password"/><div class="error" id="password-error"></div><br>
					
			<label>Password confirmation: </label><br>
			<input type="password" id="conferma_password"/><div></div><br>

			<label>Expertise: </label><br>
			<textarea type="text" id="expertise"></textarea><div class="error" id="expertise-error"></div><br>
					
			<input type="submit" name="invio" value="Sign up" onclick="checkUser()">
			
			


		</div>
		<br>
	<div class="container">
		<a id="to-login" href="index.php">Login page</a>
	</div>

	</body>
</html>
