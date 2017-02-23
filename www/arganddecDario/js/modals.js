function modalInitNode(type){

    setNodeColor(type);

	$('#node-modal').find('.modal-title').html("Insert information about the new " + type + " node.");

	var msg = "<h3> Info </h3>";
    msg += "<ul style='list-style-type: none;'>";
//    msg += "<li class='id-modal' style='display: none;'>Id: &nbsp; <b>"+id+"</b><br></li>";
    
    msg += "<li class='type-modal' style='display: none;'>Type: &nbsp; <b>"+type+"</b><br></li>";
    msg += "<li class='name-modal'>Name: <input type='text' class='form-control' placeholder='Name'></input></li><br>";
    msg += "<li class='basevalue-modal'>Base value: &nbsp; <input type='text' class='form-control' placeholder='0.5'></input></li><br>";
    msg += "<li class='computedvalue-modal'>Computed value: &nbsp; <input type='text' class='form-control' placeholder='0'></input></li><br>";
    msg += "<li class='typevalue-modal'>Tag: &nbsp; <input type='text' class='form-control' placeholder='"+thisUsername+"'></input></li><br>";
    msg += "<li class='state-modal'>State: &nbsp; "+selectState(type)+"</li><br>";
    msg += "<li class='attachment-modal'>Attachment: &nbsp; <input type='text' class='form-control' placeholder='Attachment'></input></li>";
    msg += "</ul>";
    $('#node-modal').find('.modal-body').html(msg);

    $('#node-modal').find('.btn:eq(1)').attr('onClick', 'addNode()');

    $('#node-modal').find('.btn:eq(1)').focus();
    $('#node-modal').find('.btn:eq(1)').attr('tabindex','1');

    // Appling color styles.
    $('#node-modal').find('.modal-header').css('background-color',color);
    $('#node-modal').find('.btn:eq(1)').attr('class','btn '+button);

    $('#node-modal').modal('show');

}

function modalEditNode(node){

     var id = node.id;
     var type = node.type;

    if (type=='issue') {
        color = '#428BCA';
        button = 'btn-primary';
    }
    else if (type=='answer') {
        color = '#E3972F';
        button = 'btn-warning';
    }
    else if (type=='pro') {
        color = '#53AD54';
        button = 'btn-success';
    }
    else if (type=='con') {
        color = '#D24642';
        button = 'btn-danger';
    }

    $('#node-modal').find('.modal-title').html("Insert informations about the node " + id + " .");

    var msg = "<h3> Edit </h3>";
    msg += "<ul style='list-style-type: none;'>";
//    msg += "<li class='id-modal'>Id: &nbsp; <b>"+id+"</b></li><br>";
//    msg += "<li class='type-modal'>Type: &nbsp; <b>"+type+"</b></li><br>";
    msg += "<li class='name-modal'>Content: <input type='text' class='form-control' value='"+node.name+"'></input></li><br>";
    msg += "<li class='basevalue-modal'>Base value: &nbsp; <input type='text' class='form-control' value='"+node.baseValue+"'></input></li><br>";
    msg += "<li class='computedvalue-modal'>Computed value: &nbsp; <input type='text' class='form-control' value='"+node.computedValue+"'></input></li><br>";
    msg += "<li class='typevalue-modal'>Tags: &nbsp; <input type='text' class='form-control' value='"+node.typeValue+"'></input></li><br>";
    msg += "<li class='attachment-modal'>Attachment: &nbsp; <input type='text' class='form-control' value='"+node.attachment+"'></input></li><br>";
    msg += "</ul>";
    $('#node-modal').find('.modal-body').html(msg);

    // Appling color styles.
    $('#node-modal').find('.modal-header').css('background-color',color);
    $('#node-modal').find('.btn:eq(1)').attr('class','btn '+button);


    $('#node-modal').find('.btn:eq(1)').attr('onClick', 'editNode(nodeList['+id+'])' );

    $('#node-modal').modal('show');

}


function editNodeFromModal(id){
    var newName = $(".name-modal > input").val();
    var newBaseValue = $(".basevalue-modal > input").val();
    var newComputedValue = $(".computedvalue-modal > input").val();
    var newTypeValue = $(".typevalue-modal > input").val();
    var newState = $(".state-modal > input").val();
    var newAttachment = $(".attachment-modal > input").val();

    var text = newName;
    if (text.length>labelLength) {
        text = text.substring(0,labelLength-1)+"...";
    };

    $("#"+id+" > #name").html(text);
    $("#"+id+" > #name").attr('title',newName);
    nodeList[id].editInfo(newName, newBaseValue, newComputedValue, newTypeValue, newState, newAttachment);
}

function modalInitDebate(ownerid){

    var id = $(".debate").length;

    color = '#5BC0DE';
    button = 'btn-info';

    $('#debate-modal').find('.modal-title').html("Insert informations about the new debate.");

    var msg = "<h3> Info </h3>";
    msg += "<ul style='list-style-type: none;'>";
    msg += "<li class='id-modal' style='display: none;'>Id: &nbsp; <b>"+id+"</b><br></li>";
    msg += "<li class='ownerid-modal' style='display: block;'>ownerid: &nbsp; <b>"+ownerid+"</b></li><br>";
    msg += "<li class='name-modal'>Name: <input type='text' class='form-control' placeholder='Name'></input></li><br>";
    msg += "<li class='defaultbasevalue-modal'>Default base value: &nbsp; <input type='text' class='form-control' placeholder='0.5'></input></li><br>";
//    msg += "<li class='participants-modal'>Participants: &nbsp; <input type='text' class='form-control' placeholder='Participants'></input></li><br>";
    msg += "<li class='typevalue-modal'>Content: &nbsp; <input type='text' class='form-control' placeholder='Type value'></input></li><br>";
    msg += "</ul>";
    $('#debate-modal').find('.modal-body').html(msg);

    $('#debate-modal').find('.btn:eq(1)').attr('onClick', 'addDebate();');

    // Appling color styles.
    $('#debate-modal').find('.modal-header').css('background-color',color);
    $('#debate-modal').find('.btn:eq(1)').attr('class','btn '+button);

    $('#debate-modal').modal('show');
}

function modalEditDebate(debate){

    var id = debate.id;

    color = '#5BC0DE';
    button = 'btn-info';

    $('#debate-modal').find('.modal-title').html("Insert informations about the debate " + id + " .");

    var msg = "<h3> Edit </h3>";
    msg += "<ul style='list-style-type: none;'>";
    msg += "<li class='name-modal'>Name: <input type='text' class='form-control'value='"+debate.name+"'></input></li><br>";
    msg += "<li class='defaultbasevalue-modal'>Default base value: &nbsp; <input type='text' class='form-control' value='"+debate.defaultBaseValue+"'></input></li><br>";
    msg += "<li class='participants-modal'>Participants: &nbsp; <input type='text' class='form-control' value="+debate.participants+"></input></li><br>";
    msg += "<li class='typevalue-modal'>Content: &nbsp; <input type='text' class='form-control' value="+debate.typeValue+"></input></li><br>";
    msg += "</ul>";
    $('#debate-modal').find('.modal-body').html(msg);

    // Appling color styles.
    $('#debate-modal').find('.modal-header').css('background-color',color);
    $('#debate-modal').find('.btn:eq(1)').attr('class','btn '+button);


    // Function editDebate implemented in debate-manager.js.
    $('#debate-modal').find('.btn:eq(1)').attr('onClick', 'editDebate(debateList['+id+'])' );

    $('#debate-modal').modal('show');

}

function modalAccess(debateId, debateName){

    color = '#5BC0DE';
    button = 'btn-info';

    $('#access-modal').find('.modal-title').html("Change access rights for "+debateName+".");

    var msg = "<div class='table-responsive'><div style='display:none;'><input id='search-input' style='text' class='form-control' placeholder='Search'></input><button class='btn btn-default' onClick='filterUsers()'>Search</button></div><table class='table'>";
    msg += "<tr><th><b>Name</b></th><th><b>Read</b></th><th><b>Read and Write</b></th>";

    // AJAX call for pupolation of users list.
        $.ajax({
            type: "POST",
            url: "load-users.php",
            data: "did="+debateId,
            cache: false,
            success: function(dat) {
                var obj = JSON.parse(dat);
              for (var i = 0; i < obj.length; i++){

                if (obj[i].accessright=='w'){
                    msg += "<tr class='access-row' rel="+obj[i].id+"><td><b>"+obj[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td></tr>";

                }
                else if (obj[i].accessright=='r'){
                    msg += "<tr class='access-row' rel="+obj[i].id+"><td><b>"+obj[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td></tr>";

                }
                else{
                    msg += "<tr class='access-row' rel="+obj[i].id+"><td><b>"+obj[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td></tr>";
                }

              }

              msg += "</table></div>";

              $('#access-modal').find('.modal-body').html(msg);
              $('#access-modal').find('.btn:eq(1)').attr('onClick', '');

              // Appling color styles.
              $('#access-modal').find('.modal-header').css('background-color',color);
              $('#access-modal').find('.btn:eq(1)').attr('class','btn '+button);
              $('#access-modal').find('.btn:eq(1)').attr('onClick','addRights('+debateId+')');

              $('#access-modal').modal('show');
            }
            });



}

function getOption(element){
    alert($(element).val());
}

function selectState(type){

    


    var msg = '<select class="form-control">';

    if(type=='issue'){
        msg += '<option id="basic">Basic</option>';
        msg += '<option id="resolved">Resolved</option>';
        msg += '<option id="rejected">Rejected</option>';
        msg += '<option id="insoluble">Insoluble</option>';
    }
    else if(type=='answer'){
        msg += '<option id="basic">Basic</option>';
        msg += '<option id="accepted">Accepted</option>';
        msg += '<option id="rejected">Rejected</option>';
        msg += '<option id="likely">Likely</option>';
        msg += '<option id="unlikely">Unlikely</option>';
    }
    else if(type=='pro'){
        msg += '<option id="basic">Basic</option>';
        msg += '<option id="dominant">Dominant</option>';
        msg += '<option id="fails">Fails</option>';
    }
    else if(type=='con'){
        msg += '<option id="basic">Basic</option>';
        msg += '<option id="dominant">Dominant</option>';
        msg += '<option id="fails">Fails</option>';
    }
    msg += '</select>';
    return msg;
}

function modalNaturalLanguage(){

    $('#natural-text-modal').find('.modal-title').html("Explanation");

    var msg='<div id="natural-language"><img src="gallery/loading.gif" style="display:block; margin-left:auto; margin-right:auto;"></img></div>';

    $('#natural-text-modal').find('.modal-body').html(msg);

    $('#natural-text-modal').modal('show');

}

function filterUsers(){

    $('.access-row').fadeOut();
    var searchString = $('#search-input').val();

    if (searchString.length == 0) {
        alert(searchString);
        $('.access-row').fadeIn(100);
    }
    else {
        alert(searchString);
        $(".access-row > td > b:contains('Dario')").fadeIn(100); 
    }
}
