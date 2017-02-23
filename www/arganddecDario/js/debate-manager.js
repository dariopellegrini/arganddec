var debateList = {};
var iddebate;

function addDebate(){

	// Modal initialized in modal.js file.
//  var id = $("#debate-modal").find(".id-modal > b").html();
  var ownerId = $("#debate-modal").find(".ownerId-modal > b").html();
  var name = $("#debate-modal").find(".name-modal > input").val();
  var defaultBaseValue = $("#debate-modal").find(".defaultbasevalue-modal > input").val();
  var participants = $("#debate-modal").find(".participants-modal > input").val();
  var typeValue = $("#debate-modal").find(".typevalue-modal > input").val();






if (name=="") {
    name = "Unknown Debate";
  };

$.ajax({
            type: "POST",
            url: "add-debate.php",
            data: "on="+ownerId+"&n="+name+"&dbv="+defaultBaseValue+"&p="+participants+"&tv="+typeValue,
            cache: false,
            success: function(dat) {
              var id = dat;

              var debate = new Debate(id,ownerId,name,defaultBaseValue,participants,typeValue);

              var msg = '<div id="debate'+id+'"><li class="btn-group debate">';
                  msg += '<button type="button" class="btn btn-info" onClick="parent.location=\'diagram.php?id='+id+'\'">'+name+'</button>';
                  msg += '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">';
                  msg += '<span class="caret"></span>';
                  msg += '<span class="sr-only">Toggle Dropdown</span>';
                  msg += '</button>';
                  msg += '<ul class="dropdown-menu" role="menu">';
                  msg += '<li><a href="#" onClick="debateList['+id+'].displayInfo();">Info</a></li>';
                  msg += '<li><a href="#" onClick="modalEditDebate(debateList['+id+'])">Edit</a></li>';
                  msg += '<li><a href="#" onClick="modalAccess('+id+',debateList['+id+'].name)">Access control</a></li>';
                  msg += '<li class="divider"></li>';
                  msg += '<li><a href="#" onClick="deleteDebate(debateList['+id+'])">Delete</a></li>';
                  msg += '</ul>';
                msg += '</li><br><br></div>';

                // The end 'o' means in owner tab, because is been created by this user and owned by him or her.
              $("#debate-list-o").append(msg);
              debateList[id] = debate;
                        }
            });

}

function addSubDebate(){

  // Modal initialized in modal.js file.
//  var id = $("#debate-modal").find(".id-modal > b").html();
  var ownerId = $("#debate-modal").find(".ownerId-modal > b").html();
  var name = $("#debate-modal").find(".name-modal > input").val();
  var defaultBaseValue = $("#debate-modal").find(".defaultbasevalue-modal > input").val();
  var participants = $("#debate-modal").find(".participants-modal > input").val();
  var typeValue = $("#debate-modal").find(".typevalue-modal > input").val();




if (name=="") {
    name = "Unknown Debate";
  };

$.ajax({
            type: "POST",
            url: "add-debate.php",
            data: "on="+ownerId+"&n="+name+"&dbv="+defaultBaseValue+"&p="+participants+"&tv="+typeValue,
            cache: false,
            success: function(dat) {
              var id = dat;
              var debate = new Debate(id,ownerId,name,defaultBaseValue,participants,typeValue);
              debateList[id] = debate;

                // Node creation.
                var baseValue = 0;
                var computedValue = 0;
                var type = 'por';
                var typeValue = '';
                var state='';
                var attachment = '';
                  $.ajax({
                    type: "POST",
                    url: "add-node.php",
                    data: "n="+name+"&bv="+baseValue+"&cv="+computedValue+"&t="+type+"&tv="+typeValue+"&s="+state+"&a="+attachment+"&ld"+id,
                    cache: false,
                    success: function(dat) {
                      var nid = dat;
                      var node = new Node(nid,name,baseValue,computedValue,type,typeValue,state,attachment,{},{},id);
                      node.initializeDebateNode();
                      nodeList[id] = node;

            }
            });

            }
            });


}

function loadDebates(){

  $.ajax({
            type: "POST",
            url: "load-debates.php",
            data: "",
            cache: false,
            success: function(dat) {
              var obj = JSON.parse(dat);
              var msg = "";

              for (var i = 0; i < obj.length; i++) {

                var id = obj[i].id;
                var ownerId = obj[i].ownerid;
                var name = obj[i].name;
                var defaultBaseValue = obj[i].defaultbasevalue;
                var participants = obj[i].participants;
                var typeValue = obj[i].typevalue;

                var right = obj[i].accessright;

                var debate = new Debate(id,ownerId,name,defaultBaseValue,participants,typeValue);

              var msg = '<div id="debate'+id+'"><li class="btn-group debate">';
                  msg += '<button type="button" class="btn btn-info" onClick="parent.location=\'diagram.php?id='+id+'\'">'+name+'</button>';
                  msg += '<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown">';
                  msg += '<span class="caret"></span>';
                  msg += '<span class="sr-only">Toggle Dropdown</span>';
                  msg += '</button>';
                  msg += '<ul class="dropdown-menu" role="menu">';
                  msg += '<li><a href="#" onClick="debateList['+id+'].displayInfo();">Info</a></li>';
                  msg += '<li><a id="modal-edit-debate" href="#" onClick="modalEditDebate(debateList['+id+'])">Edit</a></li>';
                  msg += '<li><a id="modal-access-button" href="#" onClick="modalAccess('+id+',debateList['+id+'].name)">Access control</a></li>';
                  msg += '<li class="divider"></li>';
                  msg += '<li><a href="#" id="delete-debate-button" onClick="deleteDebate(debateList['+id+'])">Delete</a></li>';
                  msg += '</ul>';
                msg += '</li><br><br></div>';

              $("#debate-list-"+right).append(msg);

              // Hiding button in fuction of the right value.
              if (right!='o'){
                $('#debate'+id).find('#modal-access-button').fadeOut(100);
                $('#debate'+id).find('.divider').fadeOut(100);
                $('#debate'+id).find('#delete-debate-button').fadeOut(100);
              }

              if(right!='o' && right!='w'){
                $('#debate'+id).find('#modal-edit-debate').fadeOut(100);
              }

              debateList[id] = debate;

              }


            }
            });

}

function deleteDebate(debate){

  bootbox.confirm("<h3>Delete debate " + debate.name + "?</h3>", function(result){
        if(result){

          $.ajax({
            type: "POST",
            url: "delete-debate.php",
            data: "id="+debate.id,
            cache: false,
            success: function(dat) {
              $("#debate"+debate.id).fadeOut(300, function(){

                delete debateList['debate.id'];

              });

            }
            });

        }
      });

}

function editDebate(debate){

    var newName = $('#debate-modal').find(".name-modal > input").val();
    var newDefaultBaseValue = $('#debate-modal').find(".defaultbasevalue-modal > input").val();
    var newParticipants = $('#debate-modal').find(".participants-modal > input").val();
    var newTypeValue = $('#debate-modal').find(".typevalue-modal > input").val();

    $.ajax({
            type: "POST",
            url: "edit-debate.php",
            data: "id="+debate.id+"&n="+newName+"&dbv="+newDefaultBaseValue+"&p="+newParticipants+"&tv="+newTypeValue,
            cache: false,
            success: function(dat) {

              $("#debate"+debate.id+" > .debate > .btn:eq(0)").html(newName);
              debate.editInfo(newName, newDefaultBaseValue, newParticipants, newTypeValue);

            }
            });
}