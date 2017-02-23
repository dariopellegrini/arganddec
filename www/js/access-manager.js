function addRight(debateId, element){

	var userId = $(element).closest('tr').attr('rel');
	var right;

	if ($(element).attr('class')=='readwrite-right'){
		automaticCheck(element);
	}
	else {
		automaticUnCheck(element);
	}

	if ($(element).closest('tr').find('.readwrite-right').is(':checked')){
		right='w';
	}
	else if ($(element).closest('tr').find('.read-right').is(':checked')){
		right='r';
	}
	else {
		right='';
	}

	  $.ajax({
            type: "POST",
            url: "save-right.php",
            data: "uid="+userId+"&did="+debateId+"&r="+right,
            cache: false,
            success: function(dat) {


            }
            });
}

// The function check the read right checkbox if the read and write right checkbox is checked and is called by onClick od read and write checkbox.
function automaticCheck(element){

	if($(element).is(':checked')){
		$(element).closest('tr').find('.read-right').prop('checked', true);
	}

}

function automaticUnCheck(element){

	if(!$(element).is(':checked')){
		$(element).closest('tr').find('.readwrite-right').prop('checked', false);
	}

}