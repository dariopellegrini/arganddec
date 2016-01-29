function buildNaturalText(){

	modalNaturalLanguage();

	computeAllValues(false);

	var issueList=getIssueList();


	// Best answer.
	var msg='';

	for(var n in issueList){

		var answerList=getTypeNodes(issueList[n].sourceList,'answer');



		msg+='Speaking about issue "'+issueList[n].name+'", ';
		if(listLength(answerList)==0){
			msg+='there is no best answer, because there are no answer nodes connected to it';
		}
		else{

		msg+='the best answer found after QuadArc algorithm execution is the answer ';
		var bestAnswer=getBestNode(issueList[n].sourceList);

		msg+='"'+bestAnswer.name+'"';

		if(listLength(answerList)==1){
			msg+=', only because this is the only answer connected to it. '
		}
		else{
			msg+='. ';
			msg+=descendantsProcess(bestAnswer);
		}
	}

	}

	$('#natural-language').html(msg);
    $('#natural-text-modal').find('.btn:eq(1)').attr('onClick','speak()');



}

function descendantsProcess(node){

		var proList=getTypeNodes(node.sourceList,'pro');
		var conList=getTypeNodes(node.sourceList,'con');
		var proNum=listLength(proList);
		var conNum=listLength(conList);

		var msg='Indeed this '+node.type+' node has ';

		if(proNum>0 && conNum==0){

			if(proNum==1){
				for(var n in proList){
					msg+='"'+proList[n].name+'" as the only pro argument and no con argument. ';
					if(listLength(proList[n].sourceList)>0){
						msg+='Also the '+proList[n].type+' node "'+proList[n].name+'" has descendant from which its value is computed. '
						msg+=descendantsProcess(proList[n]);
					}
				}
			}
			else{
				msg+=proNum+' pro nodes and no con node. ';
				msg+='These pro nodes give to "'+node.name+'" a value of '+node.computedValue+'. '
				msg+=proNodesProcess(proList);
		}
	}
		else if(proNum!=0 && conNum!=0){
			msg+=proNum+' pro '+singularOrPlural(proNum)+' and '+conNum+' con '+singularOrPlural(conNum)+'. ';

			if(proNum>conNum*2){
				msg+='In this case pro nodes are a lot more than con nodes, that with an average value of '+getAverageValue(conList)+' are not enough for the pro nodes\' values. ';
				msg+='These pro nodes give to "'+node.name+'" a value of '+node.computedValue+'. ';
				msg+=proNodesProcess(proList);
			}
			else if(proNum>conNum){
				msg+='In this case number of pro nodes and number of con nodes are similar. ';
				msg+='Con nodes are less and, with an average value of '+getAverageValue(conList)+', are not enough for the values of pro nodes. ';
				msg+='Pro nodes instead are very strong and give to "'+node.name+'" a value of '+node.computedValue+'. '
				msg+=proNodesProcess(proList);
			}
			else{
				msg+='Even if number of pro nodes doesn\'t pass the one of con nodes, con nodes have an average value of '+getAverageValue(conList)+' that is not enough for the pro nodes\' values. ';
				msg+='Thank to pro nodes, "'+node.name+'" has a value of '+node.computedValue+'. ';
				msg+=proNodesProcess(proList);
			}
		}
		else{
			msg+='the biggest value between the answers. '
		}

		return msg;
	}

function proNodesProcess(proList){

		var proNum=listLength(proList);

		var msg='Their average value is '+getAverageValue(proList)+'. ';

			for(var n in proList){
					if(listLength(proList[n].sourceList)>0){
						msg+='Also the '+proList[n].type+' node "'+proList[n].name+'" has descendant from which its value is computed. '
						msg+=descendantsProcess(proList[n]);
					}
				}
		return msg;	

}

function speak(){

	var string=$('#natural-language').html();
	var fallbackSpeechSynthesis = window.getSpeechSynthesis();
	var fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance();
	var message=new fallbackSpeechSynthesisUtterance(string); // 'About issue "I1", "A1" alternative is the best whithin the 3 checked, because of the "P1" favourite opinion. The "A2", instead, is not advisable because of the screditation by the "C1" con argument. Infact "C1" is substained by 3 pro argument ("Pro1", "Pro2", "Pro3").'
	message.lang='en';
	fallbackSpeechSynthesis.speak(message);

}

function getIssueList(){

	var issueList=[];

	for(var n in nodeList){
		if(nodeList[n].type=='issue'){
			issueList.push(nodeList[n]);
		}
	}

	return issueList;

}

function getBestNode(nodeList){

	var maxNode;
	var maxValue=0;

	for(var n in nodeList){
		if(nodeList[n].computedValue>maxValue){

			maxNode=nodeList[n];
			maxValue=nodeList[n].computedValue;

		}
	}

	return maxNode;

}

function getTypeNodes(nodeList,type){

	var typeList=[];

	for(var n in nodeList){
		if(nodeList[n].type==type){
			typeList.push(nodeList[n]);
		}
	}

	return typeList;

}

function listLength(nodeList){

	var length=0;

	for(var n in nodeList){
		length++;
	}

	return length;

}

function getAverageValue(nodeList){

	var sum=0;

	for(var n in nodeList){
		sum+=nodeList[n].computedValue;
	}

	return Math.round(sum/listLength(nodeList) * 1000) / 1000;

}

function getVarianceValue(nodeList){

	var average=getAverageValue(nodeList);
	var sum=0;

	for(var n in nodeList){
		sum+=(nodeList[n].computedValue-average)*(nodeList[n].computedValue-average);
	}

	return Math.round(sum/listLength(nodeList) * 1000) / 1000;

}

function singularOrPlural(num){
	if(num==1){
		return 'node';
	}
	else {
		return 'nodes';
	}
}