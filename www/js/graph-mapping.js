function graphMapping(){

	// Execute computation on every node.
	// alert(listLength(nodeList));
	computeAllValues(false);

	var matrixJSON = [];
	matrixJSON.push([]);

	var addedEffect=[];

	// Add variants and effects without cells.
	for(var n in nodeList){

		if(nodeList[n].type=='answer'){
			if(checkNonIssueSource(nodeList[n])){
				var item={};
				item['id']=nodeList[n].id;
				item['label']=nodeList[n].name;
				item['value']=nodeList[n].baseValue;
				matrixJSON[0].push(item);
			}
		}
	}
		for(var n in nodeList){
			if((nodeList[n].type=='pro' || nodeList[n].type=='con') && (checkCorrectLevel(nodeList[n],matrixJSON[0])) ){
			var value = nodeList[n].computedValue!='0' ? nodeList[n].computedValue : nodeList[n].baseValue;

		//	if(typeof addedEffect[nodeList[n].name+value]=='undefined'){
				var effectRow=[];
				var effect={};
				effect['id']=n;
				effect['label']=nodeList[n].name;
				effect['value']= value;
				effectRow.push(effect);
		//		addedEffect[n]=nodeList[n];

		matrixJSON.push(effectRow);

		//}
	}

}
	

	console.log(JSON.stringify(matrixJSON));
//	return;

	// Add cells according with the sign.
	for(var i=1; i<matrixJSON.length; i++){

		var effectId=matrixJSON[i][0].id;
		var effectLabel=matrixJSON[i][0].label;
		var effectValue=matrixJSON[i][0].value;

		for(var j=0; j<matrixJSON[0].length; j++){

			var type=checkEdgesFromId(effectId,matrixJSON[0][j].id)

			var sign='0';

			if(type=='pro'){
				sign='+';
			}
			else if(type=='con'){
				sign='-';
			}

			matrixJSON[i].push({"label":sign, "value":effectId});

		//	console.log(matrixJSON[0][j].label+" "+matrixJSON[i][0].label);
		//	console.log(JSON.stringify(types));


		}
	}
			


	bootbox.confirm('<h3> Insert a name for the new table.</h3><br><input type="text" id="input-matrix" class="form-control" placeholder="Matrix"/>', function(result){

    if(result){
    var matrixName = $('#input-matrix').val();

    if(matrixName==''){
    	matrixName="Unknown matrix";
    }

    $.ajax({
            url: "add-matrix.php",
            type: "POST",
            data: {
              name: matrixName,
              table: matrixJSON
            },
            success: function (dat) {

            	var matrixId=dat.substring(dat.lastIndexOf('id=\"')+4,dat.lastIndexOf('\" c'));

            	freezeGraph(matrixId);

            	// This function is implemented in matrix-manager.js.
            	addMapping(thisDebateId,matrixId,"debate");

            	bootbox.confirm('<h3>Graph mapping has been successful. Access the tables page?</h3>',function(result){
            		if(result){
            			window.open('tables.php?id='+matrixId,'_blank');
            		}
        });

            }
        });

          }

     });

}

function freezeGraph(thisMatrixId){

	var jsonNodes=[];
	for(var n in nodeList){
		var node={};
		node['originalid']=n;
		node['name']=nodeList[n].name;
		node['basevalue']=nodeList[n].baseValue;
		node['computedvalue']=nodeList[n].computedValue;
		node['type']=nodeList[n].type;
		node['typevalue']=nodeList[n].typeValue;
		node['state']=nodeList[n].state;
		node['attachment']=nodeList[n].attachment;

		jsonNodes.push(node);
	}

	var jsonEdges=[];
	for(var n in edgeList){
		var edge={};
		edge['originalid']=n;
		edge['sourceid']=edgeList[n].source.id;
		edge['targetid']=edgeList[n].target.id;

		jsonEdges.push(edge);
	}
	console.log(JSON.stringify(jsonNodes));
	    $.ajax({
            url: "freeze-matrix.php",
            type: "POST",
            data: {
            	'matrixid':thisMatrixId,
            	nodes: jsonNodes,
            	edges: jsonEdges
            },
            success: function (dat) {
            }
        });
}

function checkNonIssueSource(node){


	var targetList = node.targetList;

	for(var n in targetList){
		if(targetList[n].type!='issue'){
			return false;
		}
	}

	return true;

}

function checkEdgeExistence(srcNode,dstId){

	var targetList = srcNode.targetList;
	// alert(nodeList[dstId].name+" "+listLength(nodeList[dstId].sourceList));
	for(var n in targetList){
		if(targetList[n].id==dstId){
			return true;
		}
	}

	return false;

}

function checkEdgesFromId(srcId,dstId){

	var result=0;
	var results=[];

	var sourceList=nodeList[dstId].sourceList;

	for(var n in sourceList){


		if(n==srcId){
		//	result=sourceList[n].type;
		return sourceList[n].type;
			results.push(sourceList[n].type);
		}
	}

//	console.log(returnDominantEffect(results));
	return 0;

}

function returnDominantEffect(results){

	var val=0;

	for(var n in results){
		if(results[n]=='pro'){
			val++;
		}
		else if(results[n]=='con'){
			val--;
		}
	}

	return val;
}

function checkCorrectLevel(node,answersList){

	console.log("AnswersList: "+JSON.stringify(answersList));
	for(var j=0; j<answersList.length; j++){
		// alert(nodeList[answersList[j].id].name);
		if(checkEdgeExistence(node,answersList[j].id)){
			console.log("THIS"+node.name+"\n");
			return true;
		}
	}

	return false;

}
