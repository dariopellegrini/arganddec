var attachment_path = '';

function modalInitNode(type){

    setNodeColor(type);
    
    $('#node-modal').find('.modal-title').html("Insert information about the new " + type + " node.");

    var msg = "<h3> Info </h3>";
    msg += "<ul style='list-style-type: none;'>";
//  msg += "<li class='id-modal' style='display: none;'>Id: &nbsp; <b>"+id+"</b><br></li>";
    
    msg += "<li class='type-modal' style='display: none;'>Type: &nbsp; <b>"+type+"</b><br></li>";
    msg += "<li class='name-modal'>Name: <input type='text' class='form-control' placeholder='Name'></input></li><br>";
    msg += "<li class='basevalue-modal'>Base value: &nbsp; <input type='text' class='form-control' placeholder=''></input></li><br>";
    msg += "<li class='computedvalue-quad-modal'>Computed value Quad: &nbsp; <input type='text' class='form-control' placeholder='0'></input></li><br>";
    msg += "<li class='computedvalue-dfquad-modal'>Computed value DF-Quad: &nbsp; <input type='text' class='form-control' placeholder='0'></input></li><br>";
    msg += "<li class='typevalue-modal'>Tag: &nbsp; <input type='text' class='form-control' placeholder='"+thisUsername+"'></input></li><br>";
    msg += "<li class='state-modal'>State: &nbsp; "+selectState(type)+"</li><br>";
    
    msg += "<li class='attachment-modal'>Attachment: &nbsp; \n\ <input id=\"url_attachment\" type='text' class='form-control' placeholder='Put here a valid URL'></input>\n\
                <form id=\"attachment_form\" enctype=\"multipart/form-data\" action=\"\" method=\"POST\"> \n\
                            <input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\">Or upload a file: \n\
                            <input name=\"userfile\" type=\"file\" accept=\"application/pdf, application/x-pdf, application/acrobat, applications/vnd.pdf, text/pdf, text/x-pdf\"></br> \n\
                            <input id=\"upload_attachment\" type=\"button\" value=\"Submit\">\n\
                </form>\n\
            </li>";
    
    msg += "</ul>";

    $('#node-modal').find('.modal-body').html(msg);
    
    $('#upload_attachment').click(function() {
        attachment_path = submitAttachment();
    });
 
    $('#node-modal').find('.btn:eq(1)').attr('onClick', 'addNode(attachment_path)');
    
    $('#node-modal').find('.btn:eq(1)').focus();
    $('#node-modal').find('.btn:eq(1)').attr('tabindex','1');

    // Appling color styles.
    $('#node-modal').find('.modal-header').css('background-color',color);
    $('#node-modal').find('.btn:eq(1)').attr('class','btn '+button);

    $('#node-modal').modal('show');

}

function modalEditNode(node){
    //var attachment_path = resetVariable(attachment_path);
    
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

    $('#node-modal').find('.modal-title').html("Insert information about the node " + id + " .");

    var msg = "<h3> Edit </h3>";
    msg += "<ul style='list-style-type: none;'>";
//    msg += "<li class='id-modal'>Id: &nbsp; <b>"+id+"</b></li><br>";
//    msg += "<li class='type-modal'>Type: &nbsp; <b>"+type+"</b></li><br>";    
    
    msg += "<li class='name-modal'>Content: <input type='text' class='form-control' value=\""+node.name+"\"></input></li><br>";
    msg += "<li class='basevalue-modal'>Base value: &nbsp; <input type='text' class='form-control' value='"+node.baseValue+"'></input></li><br>";
    msg += "<li class='computedvalue-quad-modal'>Computed value Quad: &nbsp; <input type='text' class='form-control' value='"+node.computedValueQuad+"'></input></li><br>";
    msg += "<li class='computedvalue-dfquad-modal'>Computed value DF-Quad: &nbsp; <input type='text' class='form-control' value='"+node.computedValueDFQuad+"'></input></li><br>";
    msg += "<li class='typevalue-modal'>Tags: &nbsp; <input type='text' class='form-control' value='"+node.typeValue+"'></input></li><br>";
   
    msg += "<li class='attachment-modal'>Attachment: &nbsp; <input id=\"url_attachment\" type='text' class='form-control' value='"+node.attachment+"'></input></li><br> \n\
                <form id=\"attachment_form\" enctype=\"multipart/form-data\" action=\"\" method=\"POST\"> \n\
                            <input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\">Or upload a file: \n\
                            <input name=\"userfile\" type=\"file\" accept=\"application/pdf, application/x-pdf, application/acrobat, applications/vnd.pdf, text/pdf, text/x-pdf\"></br> \n\
                            <input id=\"upload_new_attachment\" type=\"button\" value=\"Submit\">\n\
                </form>\n\
            </li>";
    
    msg += "</ul>";
    
    $('#node-modal').find('.modal-body').html(msg);

    
    attachment_path = '';
    $('#upload_new_attachment').click(function() {
        submitAttachment();
    });

    // Appling color styles.
    $('#node-modal').find('.modal-header').css('background-color',color);
    $('#node-modal').find('.btn:eq(1)').attr('class','btn '+button);
    $('#node-modal').find('.btn:eq(1)').attr('onClick', 'editNode(nodeList['+id+'], attachment_path)');
    attachment_path = '';
    
    $('#node-modal').modal('show');

}

function submitAttachment() {
        var form = $('form')[0];
        var formData = new FormData(form);
  
        $.ajax({
                url: 'upload.php',
                type: 'POST',
                data: formData,
                cache: false,              
                success: function(dat){
                    var response = JSON.parse(dat);
                    var success = response["success"];
                    var path = response["path"];
                    
                    if(success === 0) {
                        bootbox.alert("Problems with the upload of the file");
                    }
                    else if(success === 1) {
                        //attachment_path = "www.arganddec.com/"+path;
                        attachment_path = path;
                        
                        bootbox.alert("Uploaded successfully!");
                        
                        return attachment_path;
                    }
                },
                contentType: false,
                processData: false
            });
}

function editNodeFromModal(id){
    var newName = $(".name-modal > input").val();
    var newBaseValue = $(".basevalue-modal > input").val();
    var newComputedValueQuad = $(".computedvalue-quad-modal > input").val();
    var newComputedValueDFQuad = $(".computedvalue-dfquad-modal > input").val();
    var newTypeValue = $(".typevalue-modal > input").val();
    var newState = $(".state-modal > input").val();
    var newAttachment = $(".attachment-modal > input").val();

    var text = newName;
    if (text.length>labelLength) {
        text = text.substring(0,labelLength-1)+"...";
    };

    $("#"+id+" > #name").html(text);
    $("#"+id+" > #name").attr('title',newName);
    nodeList[id].editInfo(newName, newBaseValue, newComputedValueQuad, newComputedValueDFQuad, newTypeValue, newState, newAttachment);
}

function modalInitDebate(ownerid){

    var id = $(".debate").length;

    color = '#5BC0DE';
    button = 'btn-info';

    $('#debate-modal').find('.modal-title').html("Insert information about the new debate.");

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
    
    makeItDraggable('#debate-modal');
    
    $('#debate-modal').modal('show');
}

function modalEditDebate(debate){

    var id = debate.id;

    color = '#5BC0DE';
    button = 'btn-info';

    $('#debate-modal').find('.modal-title').html("Insert information about the debate " + id + " .");

    var msg = "<h3> Edit </h3>";
    msg += "<ul style='list-style-type: none;'>";
    msg += "<li class='name-modal'>Name: <input type='text' class='form-control'value='"+debate.name+"'></input></li><br>";
    msg += "<li class='defaultbasevalue-modal'>Default base value: &nbsp; <input type='text' class='form-control' value='"+debate.defaultBaseValue+"'></input></li><br>";
    //msg += "<li class='participants-modal'>Participants: &nbsp; <input type='text' class='form-control' value="+debate.participants+"></input></li><br>";
    msg += "<li class='typevalue-modal'>Content: &nbsp; <input type='text' class='form-control' value="+debate.typeValue+"></input></li><br>";
    msg += "</ul>";
    $('#debate-modal').find('.modal-body').html(msg);

    // Appling color styles.
    $('#debate-modal').find('.modal-header').css('background-color',color);
    $('#debate-modal').find('.btn:eq(1)').attr('class','btn '+button);


    // Function editDebate implemented in debate-manager.js.
    $('#debate-modal').find('.btn:eq(1)').attr('onClick', 'editDebate(debateList['+id+'])' );
    makeItDraggable('#debate-modal');
    $('#debate-modal').modal('show');

}

function modalAccess(debateId, debateName){

    color = '#5BC0DE';
    button = 'btn-info';

    $('#access-modal').find('.modal-title').html("Change access rights for "+debateName+".");
    
    var msg = "<div class='table-responsive'><div><input id='search-input' style='text' class='form-control' placeholder='Search'></input>\n\
                <button id='btn_search' class='btn btn-default' onClick='filterUsers("+debateId+")'>Search</button>\n\
                <button id='btn_load' class='btn btn-default'>All</button>\n\
                </div>\n\
                <table id='id_table' class='table'>";
    
    $('#access-modal').find('.modal-body').html(msg);
    $('#access-modal').find('.btn:eq(1)').attr('onClick', '');
    $('#access-modal').find('.btn:eq(2)').attr('onClick', '');

    // Appling color styles.
    $('#access-modal').find('.modal-header').css('background-color',color);
    $('#access-modal').find('.btn:eq(1)').attr('class','btn '+button);
    $('#access-modal').find('.btn:eq(1)').attr('onClick','addRights('+debateId+')');
    $('#access-modal').find('.btn:eq(1)').attr('class','btn '+button);
    $('#access-modal').find('.btn:eq(1)').attr('onClick','addRights('+debateId+')');
    
    $('#btn_load').click(function() {
        loadUsers(debateId);
    });
    
    makeItDraggable('#access-modal');
    $('#access-modal').modal('show');
          
}

function loadUsers(debateId){
    color = '#5BC0DE';
    button = 'btn-info';

    $('#access-modal').find('.modal-title').html("Change access rights");// for "+debateName+".");
    
    var msg = "<div class='table-responsive'><div><input id='search-input' style='text' class='form-control' placeholder='Search'></input><button id='btn_search' class='btn btn-default' onClick='filterUsers("+debateId+")'>Search</button></div><table id='id_table' class='table'>";
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

function filterUsers(debateId){

    $('.access-row').fadeOut();
    var searchString = $('#search-input').val();

    if (searchString.length == 0) {
        bootbox.alert("Insert a username");
        $('.access-row').fadeIn(100);
    }
    else {
       
        // search users
            $.ajax({
                url:"filter-users.php",
                type:"POST",
                data: "searchQuery="+searchString+"&did="+debateId,
                cache: false,

                success: function(dat){
                           
                           var result = JSON.parse(dat);
                           //console.log("result "+result);
                           
                           if(result.success==0) {
                               bootbox.alert("No user found with this username");
                               loadUsers(debateId);
                           }
                           else if(result.success==1){
                                var users = result.users;
                                                               
                                color = '#5BC0DE';
                                button = 'btn-info';

                                $('#access-modal').find('.modal-title').html("Change access rights");// for "+debateName+".");

                                var msg = "<div class='table-responsive'><div>\n\
                                            <input id='search-input' style='text' class='form-control' placeholder='Search'></input>\n\
                                            <button id='btn_search' class='btn btn-default' onClick='filterUsers("+debateId+")'>Search</button>\n\
                                            <button id='btn_load' class='btn btn-default'>All</button>\n\
                                            </div>\n\
                                           <table id='id_table' class='table'>";
                                msg += "<tr><th><b>Name</b></th><th><b>Read</b></th><th><b>Read and Write</b></th>";
                                
                                for (var i = 0; i < users.length; i++){
                                        
                                  if (users[i].accessright=='o'){
                                      
                                  }
                                  else if (users[i].accessright=='w'){
                                      msg += "<tr class='access-row' rel="+users[i].id+"><td><b>"+users[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td></tr>";

                                  }
                                  else if (users[i].accessright=='r'){
                                      msg += "<tr class='access-row' rel="+users[i].id+"><td><b>"+users[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' checked onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td></tr>";

                                  }
                                  else{
                                      msg += "<tr class='access-row' rel="+users[i].id+"><td><b>"+users[i].username+"</b></td><td><input type='checkbox' class='read-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td><td><input type='checkbox' class='readwrite-right' style='float: left;' onClick='addRight("+debateId+",this)'/></td></tr>";
                                  }

                                }

                                msg += "</table></div>";

                              $('#access-modal').find('.modal-body').html(msg);
                              $('#access-modal').find('.btn:eq(1)').attr('onClick', '');
                              $('#access-modal').find('.btn:eq(2)').attr('onClick', '');

                              // Appling color styles.
                              $('#access-modal').find('.modal-header').css('background-color',color);
                              $('#access-modal').find('.btn:eq(1)').attr('class','btn '+button);
                              $('#access-modal').find('.btn:eq(1)').attr('onClick','addRights('+debateId+')');
                              $('#access-modal').find('.btn:eq(1)').attr('class','btn '+button);
                              $('#access-modal').find('.btn:eq(1)').attr('onClick','addRights('+debateId+')');
                              
                              
                              $('#btn_load').click(function() {
                                  loadUsers(debateId);
                              });
                              
                              makeItDraggable('#access-modal');
                              $('#access-modal').modal('show');
                            }
                                         

                }
        
            });
    
    }
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

function selectType(type) {
    var msg = '<select class="form-control">';

    if(type=='issue'){
        msg += '<option id="basic">Answer</option>';
        msg += '<option id="resolved">Pro</option>';
        msg += '<option id="rejected">Con</option>';       
    }
    else if(type=='answer'){
        msg += '<option id="basic">Issue</option>';
        msg += '<option id="accepted">Pro</option>';
        msg += '<option id="rejected">Con</option>';
    }
    else if(type=='pro'){
        msg += '<option id="basic">Issue</option>';
        msg += '<option id="dominant">Answer</option>';
        msg += '<option id="fails">Con</option>';
    }
    else if(type=='con'){
        msg += '<option id="basic">Issue</option>';
        msg += '<option id="dominant">Answer</option>';
        msg += '<option id="fails">Pro</option>';
    }
    msg += '</select>';
    return msg;
}

function modalNaturalLanguage(){

    $('#natural-text-modal').find('.modal-title').html("Explanation");

    var msg='<div id="natural-language"><img src="gallery/loading.gif" style="display:block; margin-left:auto; margin-right:auto;"></img></div>';

    $('#natural-text-modal').find('.modal-body').html(msg);

    makeItDraggable('#natural-text-modal');
    $('#natural-text-modal').modal('show');

}


function resetVariable(variable) {
    return variable='';
}


function makeItDraggable(id){
    $(id).draggable({
        handle: ".modal-header"
    }); 
    
}
