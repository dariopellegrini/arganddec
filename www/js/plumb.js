var instance;
var sourceEndpoint;
var targetEndpoint;

// Colors variables for node.
var color;
var button;

var nodeList = {};
var edgeList = {};

var x;
var y;

var isDragging = false;
var connectionSourceId = "n", connectionTargetId = "n";

jsPlumb.ready(function() {

// Settings user rights.
setRights();

instance = jsPlumb.getInstance({
    Endpoint : ["Dot", {radius:2}],
    HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:3, outlineWidth:2 },
    DragOptions : { cursor: 'pointer', zIndex:2000 },
    ConnectionOverlays : [
      [ "Arrow", {
        location:1,
        id:"arrow",
                width: 10,
                length:10,
                foldback:0.8
      } ]
    ],
    Container: "diagram"
  });

instance.draggable($(".item"));

// Allow edge deleting only if user has appropriate right.
if (thisRight=='o' || thisRight=='w'){
  instance.bind("click", function(connection, originalEvent) {
    bootbox.confirm("<h3 style='word-wrap: break-word;'>Delete connection from " + edgeList[connection.scope].source.name + " to " + edgeList[connection.scope].target.name + "?</h3>", function(result){
        if(result){
          instance.detach(connection);
          deleteEdge(connection.scope);
        }
      });

    });
}
  // Function called on the drop on an endpoint.
  instance.bind("beforeDrop", function(connection, originalEvent) {

    if (connectionSourceId != connection.sourceId){
      connectionSourceId = connection.sourceId;
      addEdge(connection.sourceId, connection.targetId);
    }
});

loadNodes();


});

function addNode(attachment_path){

// Modal initialized in modal.js file.
  var id = $("#node-modal").find(".id-modal > b").html();
  var name = encodeURIComponent($("#node-modal").find(".name-modal > input").val());
  var baseValue = encodeURIComponent($("#node-modal").find(".basevalue-modal > input").val());
  var computedValueQuad = encodeURIComponent($("#node-modal").find(".computedvalue-quad-modal > input").val());
  var computedValueDFQuad = encodeURIComponent($("#node-modal").find(".computedvalue-dfquad-modal > input").val());
  var type = $("#node-modal").find(".type-modal > b").html();
  var typeValue = encodeURIComponent($("#node-modal").find(".typevalue-modal > input").val());
  var state = $("#node-modal").find(".state-modal > select").val();
  var attachment = encodeURIComponent($("#node-modal").find(".attachment-modal > input#url_attachment").val());
  if(attachment_path !== '') {
      attachment += ", "+encodeURIComponent(attachment_path);
  }
 
  if (name==""){
    name = 'Node '+type;
  }

  if (baseValue==""){
    
    var result = getDefaultBaseValue(thisDebateId);
    var defaultBaseValue = result.success(function(data){
        
        var result = JSON.parse(data);
        baseValue = result.basevalue;
        
        if (computedValueQuad==""){
            computedValueQuad = '0';
          }

          if (computedValueDFQuad==""){
            computedValueDFQuad = '0';
          }

          if (typeValue==""){
            typeValue="";
          }

          // Experimantal x and y values.
          x = 20;
          y = 471;

          checkOverlap();

          //console.log(x+" "+y);

          $.ajax({
                    type: "POST",
                    url: "add-node.php",
                    data: "did="+thisDebateId+"&n="+name+"&bv="+baseValue+"&cvq="+computedValueQuad+"&cvdfq="+computedValueDFQuad+"&t="+type+"&tv="+typeValue+"&s="+state+"&a="+attachment+"&x="+x+"&y="+y,
                    cache: false,
                    success: function(dat) {
                      console.log(dat);
                      var obj = JSON.parse(dat);
                      var id = obj["nodeid"];
                      var createdBy = obj["createdby"];
                      var modifiedBy = '';

                      var node = new Node(id,decodeURIComponent(name),decodeURIComponent(baseValue),decodeURIComponent(computedValueQuad),
                                            decodeURIComponent(computedValueDFQuad),decodeURIComponent(type),decodeURIComponent(typeValue),
                                            decodeURIComponent(state),decodeURIComponent(attachment),{},{},x,y,createdBy,modifiedBy);
                      node.initializeNode();

                      console.log(node);
                      nodeList[id] = node;

                      // Automatic show of the help popover for edges creation.

                      var element_count = 0;

                      for(var e in nodeList)
                        element_count++;

                      if (element_count == 2){
                        $('#advice').popover({content: $("#advice").parent().html()}).popover('show');
                      }

                    }
                });

            });
    
    //console.log("def base value "+baseValue);
    
  }
/*
  if (computedValueQuad==""){
    computedValueQuad = '0';
  }
  
  if (computedValueDFQuad==""){
    computedValueDFQuad = '0';
  }

  if (typeValue==""){
    typeValue="";
  }

  // Experimantal x and y values.
  x = 20;
  y = 471;

  checkOverlap();

  //console.log(x+" "+y);

  $.ajax({
            type: "POST",
            url: "add-node.php",
            data: "did="+thisDebateId+"&n="+name+"&bv="+baseValue+"&cvq="+computedValueQuad+"&cvdfq="+computedValueDFQuad+"&t="+type+"&tv="+typeValue+"&s="+state+"&a="+attachment+"&x="+x+"&y="+y,
            cache: false,
            success: function(dat) {
              console.log(dat);
              var obj = JSON.parse(dat);
              var id = obj["nodeid"];
              var createdBy = obj["createdby"];
              var modifiedBy = '';
              
              var node = new Node(id,decodeURIComponent(name),decodeURIComponent(baseValue),decodeURIComponent(computedValueQuad),
                                    decodeURIComponent(computedValueDFQuad),decodeURIComponent(type),decodeURIComponent(typeValue),
                                    decodeURIComponent(state),decodeURIComponent(attachment),{},{},x,y,createdBy,modifiedBy);
              node.initializeNode();
              
              console.log(node);
              nodeList[id] = node;

              // Automatic show of the help popover for edges creation.

              var element_count = 0;

              for(var e in nodeList)
                element_count++;

              if (element_count == 2){
                $('#advice').popover({content: $("#advice").parent().html()}).popover('show');
              }

            }
        });*/



}

function getDefaultBaseValue(debateId){
    
    return $.ajax({
            type: "POST",
            url: "get-default-basevalue.php",
            data: "did="+debateId,
            cache: false,
            success: function(dat) {
                
            }
        });
 
 }
 
 
function loadNodes(){

  nodeList=[]
  $('.diagramm').html('');

    $.ajax({
            type: "POST",
            url: "load-nodes.php",
            data: "did="+thisDebateId,
            cache: false,
            success: function(dat) {
              var obj = JSON.parse(dat);
              var msg = "";

              for (var i = 0; i < obj.length; i++) {

                var id = obj[i].id;
//                var debateId = obj[i].debateId;
                var name = obj[i].name;
                var baseValue = obj[i].basevalue;
                var computedValueQuad = obj[i].computedvaluequad;
                var computedValueDFQuad = obj[i].computedvaluedfquad;
                var type = obj[i].type;
                var typeValue = obj[i].typevalue;
                var state = obj[i].state;
                var attachment = obj[i].attachment;
                var x = obj[i].x;
                var y = obj[i].y;
                var createdby = obj[i].createdby;
                var modifiedby = obj[i].modifiedby;

                setNodeColor(type);

                var node = new Node(id,decodeURIComponent(name),decodeURIComponent(baseValue),decodeURIComponent(computedValueQuad),decodeURIComponent(computedValueDFQuad),decodeURIComponent(type),decodeURIComponent(typeValue),decodeURIComponent(state),decodeURIComponent(attachment),{},{},x,y,createdby,modifiedby);

                
                node.initializeNode();

                
                nodeList[id] = node;

                resizeContainer(id);

              }

              // Order the graph on the GUI for a better visualization on page load.
            //  orderGraph();

            loadEdges();
            loadWormholes();

            }
            });

}

function deleteNode(element){
  var node = element.parentNode.parentNode.parentNode.parentNode;
  bootbox.confirm("<h3>Delete node " + nodeList[node.id].name + "?</h3>", function(result){
        if(result){

          $.ajax({
            type: "POST",
            url: "delete-node.php",
            data: "id="+node.id,
            cache: false,
            success: function(dat) {
              instance.detachAllConnections($("#"+node.id));
              $("#"+node.id).fadeOut(300,function(){$(this).remove()});

              // Delete the node from every source and target list in the graph (inefficient).
              for (var n in nodeList){
                delete nodeList[n].sourceList[node.id];
                delete nodeList[n].targetList[node.id];
              }

              delete nodeList[node.id];

              // Delete from every edge.
              for (var n in edgeList){
                if(edgeList[n].source.id==node.id || edgeList[n].target.id==node.id){

                  delete edgeList[n];

                }
              }
            }
            });

            }
            });

}


function editNode(node, new_attachment_path){
    
    console.log("new att: "+new_attachment_path);
    var id = node.id;
    var newName = $(".name-modal > input").val();
    var newBaseValue = encodeURIComponent($(".basevalue-modal > input").val());
    var newComputedValueQuad = $(".computedvalue-quad-modal > input").val();
    var newComputedValueDFQuad = $(".computedvalue-dfquad-modal > input").val();
    var newTypeValue = encodeURIComponent($(".typevalue-modal > input").val());
    
    var newState = nodeList[id].state;
    var newAttachment = encodeURIComponent($("#node-modal").find(".attachment-modal > input#url_attachment").val());
    if(newAttachment.search(new_attachment_path) !== '-1') {
        newAttachment += ", " + encodeURIComponent(new_attachment_path);
    }
   
    var text = newName;
    if (text.length>labelLength) {
        text = text.substring(0,labelLength-1)+"...";
    };

    $.ajax({
            type: "POST",
            url: "edit-node.php",
            data: "id="+node.id+"&n="+newName+"&bv="+newBaseValue+"&cvq="+newComputedValueQuad+"&cvdfq="+newComputedValueDFQuad+"&tv="+newTypeValue+"&s="+newState+"&a="+newAttachment,
            cache: false,
            success: function(dat) {
                console.log(dat);
              var obj = JSON.parse(dat);
              
              //var nodeid = obj["nodeid"];
              var modifiedBy = obj["modifiedby"];
              $("#"+id+" > #name").html(text);
              $("#"+id+" > #name").attr('title',newName);
              node.editInfo(decodeURIComponent(newName), decodeURIComponent(newBaseValue), decodeURIComponent(newComputedValueQuad), decodeURIComponent(newComputedValueDFQuad), decodeURIComponent(newTypeValue), decodeURIComponent(newState), decodeURIComponent(newAttachment),decodeURIComponent(modifiedBy));
              
              // Modifying node image.
              $('#' + id).find('img').attr('src','gallery/'+nodeList[id].type+'-'+newState.toLowerCase()+'.png');
            }
            });
}


function editComputedValueQuad(node, newComputedValue){

  nodeList[node.id].computedValueQuad=newComputedValue;
      $.ajax({
            type: "POST",
            url: "edit-node.php",
            data: "id="+node.id+"&n="+node.name+"&bv="+node.baseValue+"&cvq="+newComputedValue+"&tv="+node.typeValue+"&s="+node.state+"&a="+node.attachment,
            cache: false,
            success: function(dat) {
            }
            });

}

function editComputedValueDFQuad(node, newComputedValue){

  nodeList[node.id].computedValueDFQuad=newComputedValue;
      $.ajax({
            type: "POST",
            url: "edit-node.php",
            data: "id="+node.id+"&n="+node.name+"&bv="+node.baseValue+"&cvdfq="+newComputedValue+"&tv="+node.typeValue+"&s="+node.state+"&a="+node.attachment,
            cache: false,
            success: function(dat) {
            }
            });

}

function editPosition(node, x, y){

  // If position haven't changed do nothing.
  if (node.x==x && node.y == y){ return; }
      $.ajax({
            type: "POST",
            url: "update-position.php",
            data: "id="+node.id+"&x="+x+"&y="+y,
            cache: false,
            success: function(dat) {
              node.x = x;
              node.y = y;

            }
            });

}

function setNodeColor(type){

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

}

function getNodeColor(type){
      if (type=='issue') {
        return'#428BCA';
    }
    else if (type=='answer') {
        return '#E3972F';
    }
    else if (type=='pro') {
        return '#53AD54';
    }
    else if (type=='con') {
        return'#D24642';
    }

}

function addEdge(sourceId, targetId){
    $.ajax({
            type: "POST",
            url: "add-edge.php",
            data: "did="+thisDebateId+"&s="+sourceId+"&t="+targetId,
            cache: false,
            success: function(dat) {
              var id = dat;
              var edge = new Edge(id, nodeList[sourceId], nodeList[targetId]);
              edgeList[id] = edge;

              // Update node source and target list.
              nodeList[targetId].sourceList[sourceId] = nodeList[sourceId]; // Target node has as source list element the source node.
              nodeList[sourceId].targetList[targetId] = nodeList[targetId]; // Source node has as target list element the target node.

              // JsPlumb connection for the GUI visualization.
              instance.connect({scope:id, source:sourceId, target:targetId});
              connectionSourceId = "n", connectionTargetId = "n";

            }
            });
}

function loadEdges(){
  edgeList=[];
  instance.detachEveryConnection();
      $.ajax({
            type: "POST",
            url: "load-edges.php",
            data: "did="+thisDebateId,
            cache: false,
            success: function(dat) {
              var obj = JSON.parse(dat);
              var msg = "";

              for (var i = 0; i < obj.length; i++) {

                var id = obj[i].id;
                var sourceId = obj[i].sourceid;
                var targetId = obj[i].targetid;

                var edge = new Edge(id, nodeList[sourceId], nodeList[targetId]);
                edgeList[id] = edge;

                // Update node source and target list.
                nodeList[targetId].sourceList[sourceId] = nodeList[sourceId]; // Target node has as source list element the source node.
                nodeList[sourceId].targetList[targetId] = nodeList[targetId]; // Source node has as target list element the target node.

                // Connecting using JsPlumb. The scope is used to associate id in database with id in JsPlumb, because in JsPlumb is impossible to set the id of a connection.
                instance.connect({scope:id, source:sourceId, target:targetId});

              }


            }
            });

}

function deleteEdge(id){

            $.ajax({
            type: "POST",
            url: "delete-edge.php",
            data: "id="+id,
            cache: false,
            success: function(dat) {

              // Update node source and target list.
              delete edgeList[id].source.targetList[edgeList[id].target.id]; // Deleting from source node's target list the target node of the edge.
              delete edgeList[id].target.sourceList[edgeList[id].source.id]; // Deleting from target node's source list the source node of the edge.

              delete edgeList[id];

            }
            });


}

/*
The funciton check if the thisRight variable is equal to 'r'. This means that the user can only read the graph. So proceeds with the disabling of tools for graph editing.
*/
function setRights(){
  if(thisRight==='r'){
    $('.node-buttons > button').prop('disabled', true);
    $('.name-label').attr('onDblClick','');
    $('.edit-button').hide();
    $('.wormhole-copy-button').hide();
    $('.wormhole-paste-button').hide();
    $('.dropdown-divider').hide();
    $('.delete-node-button').hide();





  }
}


function setState(element){

  var nodeId = $(element).parents('.item').attr('id');
  var nState = $(element).html();

  nodeList[nodeId].state = nState;

      $.ajax({
            type: "POST",
            url: "edit-state.php",
            data: "id="+nodeId+"&s="+nState,
            cache: false,
            success: function(dat) {
              // Modifying node image.
              $('#'+nodeId).find('img').attr('src','gallery/'+nodeList[nodeId].type+'-'+nState.toLowerCase()+'.png');
            }
            });


}

function setType(element) {
    var nodeId = $(element).parents('.item').attr('id');
    var nType = $(element).html();
    
    nType = nType.toLowerCase();
    nodeList[nodeId].type = nType;

    $.ajax({
            type: "POST",
            url: "edit-node-type.php",
            data: "id="+nodeId+"&type="+nType,
            cache: false,
            success: function(dat) {
                var success = JSON.parse(dat);
                
                if(success.success!==0) {
                    // Modifying node image.
                    $('#'+nodeId).find('img').attr('src','gallery/'+nodeList[nodeId].type+'-basic.png');

                    var type = nodeList[nodeId].type;


                    // Giving ep the right color.
                    $('#' + nodeId).css({
                              'box-shadow' : '0px 0px 10px',
                              'color' : getRightColor(type)
                    });
                }
                else{
                    bootbox.alert("Before changing the type of the node, put at 'Basic' its state!");
                }
            }
        });
}

// Used in node.js to check if a string is an url.
function validURL(str) {
  var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

function makeValidURL(str) {
    str = str.trim();
    str = str.replace(/\s+/g, '%20');
    return str;
}

function resizeContainer(id){
    var top = $('#'+id).offset().top;
    var left = $('#'+id).offset().left;

    var w = $('.diagram').width();
    var h = $('.diagram').height();

    if(top>h){
      $('.diagram').height(top);
    }
    
    if(left+$('#'+id).width()>w){
      $('.diagram, nav').width(left+$('#'+id).width()*2);
    }

}

function resizeNodes(percent){

  $('.item').css('width', 200*percent+'px');
  $('.item').css('height', 100*percent+'px');

  // Repaint all connectors.
  instance.repaintEverything();
  instance.repaintEverything();
}

function checkOverlap(){

  for(var n in nodeList){
    if(nodeList[n].x==x && nodeList[n].y==y){
      x+=10;
      y+=10;

      checkOverlap(x,y);
    }
  }

}

function getRightColor(type){

    if (type=='issue') {
        return '#428BCA';
    }
    else if (type=='answer') {
        return '#E3972F';
    }
    else if (type=='pro') {
        return '#53AD54';
    }
    else if (type=='con') {
        return '#D24642';
    }

}
