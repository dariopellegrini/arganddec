function checkUser(){

	var specialCharacters = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?„Ω€®™æ¨œøπåß∂ƒ∞∆ªªº¬¶∑†©√∫˜µ…•«“‘¥~‹÷´`≠¡ˆ`";
	
	var verify=true;
	var username = $("#username").val();
	username = username.replace(/^\s+|\s+$/g,""); // Trim degli spazi.
	username = username.replace(/ +/g, " "); // Eliminazione degli spazi multipli
	
	var password = $("#password").val();
	var conferma_password = $("#conferma_password").val();

	var email = $("#email").val();

	var expertise = $("#expertise").val();
	expertise = expertise.replace(/^\s+|\s+$/g,"");
	expertise = expertise.replace(/ +/g, " ");
	
	if(username=="" || username==" "){$("#username-error").text("Username not inserted."); verify=false;}
		else if(username.length>30){$("#username-error").text("Username must contain a maxumum of 30 characters."); verify=false;}
			else if(!validation(username))
					{$("#username-error").text("The username inserted contains special characters."); verify=false;}
			else $("#username-error").text("");
	
	if(password==""){$("#password-error").text("Password not inserted."); verify=false;}
		else if(password.length>32){$("#password-error").text("Password must contain a maximum of 32 characters."); verify=false;} 
			else if(password!=conferma_password){$("#password-error").text("The two passwords are not equal."); verify=false;}
				else if(!validation(password))
					{$("#password-error").text("The password inserted contains special characters."); verify=false;}
				else $("#password-error").text("");


	if(email==""){$("#email-error").text("E-mail not inserted."); verify=false;}
		else if(!emailValidation(email)){$("#email-error").text("Incorrect e-mail format."); verify=false;} 
				else $("#email-error").text("");

//		if(!validation(expertise))
//					{$("#expertise-error").text("The expertise field contains special characters."); verify=false;}
//		else 
	$("#expertise-error").text("");
	
	if(verify==true){

	$.ajax({
		type: "POST",
		url: "add-user.php",
		data: "username="+username+"&email="+email+"&password="+password+"&expertise="+expertise,
		cache: false,
		success: function(dat) {
			$("#password-error").text("");
			var v = true;
			if(dat=="This username already exists."){$("#username-error").text(dat); v=false;}
			if(dat=="This e-mail already exists."){$("#email-error").text(dat); v=false;}
					if(v==true) {
						hideForms();
						$("#to-login").text("Access.")
						}
				}

		});
		}	
}

function hideForms(){
	$("#user-inserted").fadeIn();
	$("#user-inserted").slideDown();
	$("#signup-container").slideUp();
	
}

function validation(str) {
   	var specialCharacters = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?„Ω€®æ¨œøπåß∂ƒ∞∆ªªº¬¶∑†©√∫˜µ…•«“‘¥~‹÷´`≠¡ˆ`";

    for (var i = 0; i < str.length; i++) {
       if (specialCharacters.indexOf(str.charAt(i)) != -1) {
        //   alert ("File name has special characters ~`!#$%^&*+=-[]\\\';,/{}|\":<>? \nThese are not allowed\n");
           return false;
       }
    }
    return true;
}

  function emailValidation(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
