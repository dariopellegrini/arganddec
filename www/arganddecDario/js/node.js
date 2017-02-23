function Node(id, name, baseValue, computedValue, type, typeValue, state, attachment, sourceList, targetList, x, y){

	// Attributes.
	this.id = id;
	this.name = name;
	this.baseValue = baseValue;
  this.computedValue = computedValue;
	this.type = type;

  if(state==''){
    state='Basic';
  }

	this.typeValue = typeValue;
  this.state = state;
	this.attachment = attachment;
  this.sourceList = sourceList;
  this.targetList = targetList;
  this.x = x;
  this.y = y;


  // Mothods.
	this.displayInfo = displayInfo;
	this.initializeNode = initializeNode;
  this.editInfo = editInfo;
  this.getSupporters = getSupporters;
  this.getAttackers = getAttackers;
  this.printTheFunction = printTheFunction;

}


function displayInfo(){

  var msg = "<div class='container' style='width:100%; word-wrap: break-word;'><h3> Info </h3>";
    msg += "<ul style='list-style-type: none;'>";
    msg += "<li>Id: &nbsp; <b>"+this.id+"</b></li>";
    msg += "<li>Content: &nbsp; <b style='word-wrap: break-word; height:100%;'>"+this.name+"</b></li>";
    msg += "<li>Base value: &nbsp; <b>"+this.baseValue+"</b></li>";
    msg += "<li>Computed value: &nbsp; <b>"+this.computedValue+"</b></li>";
    msg += "<li>Type: &nbsp; <b>"+this.type+"</b></li>";
    msg += "<li>Tag: &nbsp; <b>"+this.typeValue+"</b></li>";
    msg += "<li>State: &nbsp; <b>"+this.state+"</b></li>";

    // If it's an URI make it clickable, else make it a normal string.
    if(validURL(this.attachment)){
      msg += "<li>Attachment: &nbsp; <a href="+this.attachment+" target='_blank'>"+this.attachment+"</a></li>";
    }
    else {
      msg += "<li>Attachment: &nbsp; <b>"+this.attachment+"</b></li>";
    }

    msg += "</ul></div>";
  bootbox.alert(msg);

}

function initializeNode(){
  
  // Creating new div.
  $('<div class="item" id="' + this.id + '"  style="text-align: center;">').fadeIn(300).appendTo(".diagramm").html($(("#"+this.type))[0].innerHTML);

  // Creating function button.
  $('#' + this.id).find("#function-button").attr('onclick', 'nodeList["'+this.id+'"].printTheFunction()');

  // Creating info button.
  $('#' + this.id).find("#info-button").attr('onclick', 'nodeList["'+this.id+'"].displayInfo()');

  // Creating edit button.
  $('#' + this.id).find("#edit-button").attr('onclick', 'modalEditNode(nodeList["' + this.id + '"])');

  // Creating wormhole copy and paste buttons.
  $('#' + this.id).find("#wormhole-copy-button").attr('onclick', 'copyWormhole(' + this.id + ')');
  $('#' + this.id).find("#wormhole-paste-button").attr('onclick', 'pasteWormhole(' + this.id + ')');

  // Init name label.
  var text = this.name;
    if (text.length>labelLength) {
      text = text.substring(0,labelLength-1)+"...";
    }

  $('#' + this.id + ' > #name').html(this.name);
  $('#' + this.id + ' > #name').attr('title',this.name);

  // Setting node position;
  $('#' + this.id).offset({ left: this.x, top: this.y });

  // Setting state image.
  if(this.state!=''){
    $('#' + this.id).find('img').attr('src','gallery/'+this.type+'-'+this.state.toLowerCase()+'.png');
  }

  // Making the new div draggable.
  instance.draggable($('#' + this.id));

  // Check for graph modification rights. All depends on filter element in makeSource.
  var dragComponentClass = 'null';

  if (thisRight=='o' || thisRight=='w'){
    dragComponentClass = '.ep';
  }

  // Adding endPoints to the new div, a source and a target.
  instance.makeSource($('#' + this.id), {
        filter:dragComponentClass,
        anchor:"Continuous",
        connector:["Bezier", { curviness:63 } ],
        connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:3, outlineWidth:4},
        
      });

    instance.makeTarget($('#' + this.id), {
    dropOptions:{ hoverClass:"dragHover" },
    anchor:"Continuous",
    allowLoopback:false
  });


  // For highlight feature.
  $('#'+this.id).mousedown(function() {
    instance.select().setPaintStyle({ strokeStyle:"#5c96bc", lineWidth:3, outlineWidth:4});
    instance.select({source:this.id}).setPaintStyle({ strokeStyle:getNodeColor(nodeList[this.id].type), lineWidth:3, outlineWidth:4});
    instance.select({target:this.id}).setPaintStyle({ strokeStyle:getNodeColor(nodeList[this.id].type), lineWidth:3, outlineWidth:4});

    $('.item').css({
            'box-shadow' : '0px 0px 10px',
            'z-index' : '0'
        });

    $('#'+this.id).css({
            'box-shadow' : '0px 0px 30px',
            'z-index' : '10'
        });

    

  //  alert($('#'+this.id).offset().left + " " + $('#'+this.id).offset().top);
  });

  $('#'+this.id).mouseup(function() {

    editPosition(this, $('#'+this.id).offset().left, $('#'+this.id).offset().top);

    // Function in plumb.js.
    resizeContainer(this.id);

  //  alert($('#'+this.id).offset().left + " " + $('#'+this.id).offset().top);
  });

  // Giving ep the right color.
  $('#' + this.id).css({
            'box-shadow' : '0px 0px 10px',
            'color' : getRightColor(this.type)
        });
}

function editInfo(name, baseValue, computedValue, typeValue, state, attachment){
  this.name = name;
  this.baseValue = baseValue;
  this.computedValue = computedValue;
  this.typeValue = typeValue;
  this.state = state;
  this.attachment = attachment;
}

function getSupporters(){
  var supporters = [];

  for (var s in edgeList){
    if (edgeList[s].target.id==this.id & edgeList[s].source.type=="pro") {
    //  supporters[edgeList[s].source.id] = edgeList[s].source;
    supporters.push(edgeList[s].source);
    }
  }

  return supporters;
}

function getAttackers(){
  var attackers = [];

  for (var a in edgeList){
    if (edgeList[a].target.id==this.id & edgeList[a].source.type=="con") {



//      attackers[edgeList[a].source.id] = edgeList[a].source;
      attackers.push(edgeList[a].source);
    }
  }

  return attackers;
}

function printTheFunction(){
  // Use of extend as clone of hashmap.
  var nl = $.extend({},nodeList);

/*
  var msg = "Source: ";
  for (var n in this.sourceList){
    msg += this.sourceList[n].name;
  }

  alert(msg);

  var msg = "Target: ";
  for (var n in this.targetList){
    msg += this.targetList[n].name;
  }

  alert(msg);
  
 // delete nl[this.id];

  alert(nodeList[this.id].name);
  alert(nl[this.id].name);
  */

  checkCyclic();


}
