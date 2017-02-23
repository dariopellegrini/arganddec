function managePush(data){


	if(data.userid==thisUserId || data.debateid!=thisDebateId){
		return;
	}
	else{

		if(data.push=='add-node'){

			pushAddedNode(data);

		}
		else if(data.push=='delete-node'){
			pushNodeDelete(data);
		}
		else if(data.push=='add-edge'){
			pushAddedEdge(data);
		}
		else if(data.push=='delete-edge'){
			pushEdgeDelete(data);
		}
		else if(data.push=='edit-node'){
			pushNodeEdit(data);
		}
		else if(data.push=='edit-state'){
			pushStateEdit(data);
		}
		else if(data.push=='paste-wormhole'){
			pushWormhole(data);
		}
		else if(data.push='update-position'){
			pushPositionUpdate(data);
		}
	}

}

function pushAddedNode(data){

	var pushedNode=new Node(data.nodeid,data.name,data.basevalue,data.computedvaluequad,data.computedvaluedfquad,data.type,data.typevalue,data.state,data.attachment,{},{},data.x,data.y,data.createdby,data.modifiedby);
        
	pushedNode.initializeNode();

	nodeList[data.nodeid]=pushedNode;

}

function pushNodeDelete(data){

	instance.detachAllConnections($("#"+data.nodeid));

	$("#"+data.nodeid).fadeOut(300,function(){$(this).remove()});

	// Delete the node from every source and target list in the graph (inefficient).

	for (var n in nodeList){
		delete nodeList[n].sourceList[data.nodeid];
		delete nodeList[n].targetList[data.nodeid];
	}

	delete nodeList[data.nodeid];
        
	// Delete from every edge.
	for (var n in edgeList){
		if(edgeList[n].source.id==data.nodeid || edgeList[n].target.id==data.nodeid){
			delete edgeList[n];
		}
	}

}

function pushAddedEdge(data){

	var edge = new Edge(data.edgeid,nodeList[data.sourceid],nodeList[data.targetid]);
	edgeList[data.edgeid]=edge;

	// Update node source and target list.
	nodeList[data.targetid].sourceList[data.sourceid] = nodeList[data.sourceid]; // Target node has as source list element the source node.
	nodeList[data.sourceid].targetList[data.targetid] = nodeList[data.targetid]; // Source node has as target list element the target node.

	// JsPlumb connection for the GUI visualization.
	instance.connect({scope:data.edgeid, source:data.sourceid, target:data.targetid});

}

function pushEdgeDelete(data){

	instance.select().each(function(conn) {
		if (conn.source.id===edgeList[data.edgeid].source.id && conn.target.id===edgeList[data.edgeid].target.id){
			instance.detach(conn);
		}
	});

	// Update node source and target list.
	delete edgeList[data.edgeid].source.targetList[edgeList[data.edgeid].target.id]; // Deleting from source node's target list the target node of the edge.

	delete edgeList[data.edgeid].target.sourceList[edgeList[data.edgeid].source.id]; // Deleting from target node's source list the source node of the edge.

	delete edgeList[data.edgeid];

}

function pushNodeEdit(data){

    var text = data.name;
    if (text.length>labelLength) {
        text = text.substring(0,labelLength-1)+"...";
    }

	$("#"+data.nodeid+" > #name").html(text);
	$("#"+data.nodeid+" > #name").attr('title',data.name);
        
        //console.log("pushEditNode: "+data.name+" "+data.createdby+" "+data.modifiedby);
	nodeList[data.nodeid].editInfo(decodeURIComponent(data.name), decodeURIComponent(data.basevalue), decodeURIComponent(data.computedvaluequad), decodeURIComponent(data.computedvaluedfquad), decodeURIComponent(data.typevalue), decodeURIComponent(data.state), decodeURIComponent(data.attachment), decodeURIComponent(data.modifiedby));


}

function pushStateEdit(data){

	 nodeList[data.nodeid].state = data.state;
         nodeList[data.nodeid].modifiedby = data.modifiedby;
         nodeList[data.nodeid].editStateInfo(decodeURIComponent(data.state), decodeURIComponent(data.modifiedby));
	 $('#'+data.nodeid).find('img').attr('src','gallery/'+nodeList[data.nodeid].type+'-'+data.state.toLowerCase()+'.png');
}

function pushWormhole(data){

	console.log("Log: "+JSON.stringify(data.json));

	if(data.json.charAt(0)!='['){
		return;
	}
	var obj = JSON.parse(data.json);
	$("#"+data.dstnode+" > .dropdown-wormholes").append("<li><a href='diagram.php?id="+obj[0].id+"&nid="+obj[0].srcnode+"'><b>"+obj[0].name+"</b> &rarr; <b>"+obj[0].srcnodename+"</b></li>");
	$("#"+data.dstnode+" > .wormhole-label").fadeIn(300);

}

function pushPositionUpdate(data){
       
	$('#'+data.nodeid).offset({ left: data.x, top: data.y });
        instance.repaintEverything();
	nodeList[data.nodeid].x=x;
	nodeList[data.nodeid].y=y;

}
