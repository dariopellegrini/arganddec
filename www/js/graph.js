var decimals=6;

function checkIfTree(){

	for(n in nodeList){
		if(nodeList[n].type=='issue'){
			var visited=[];
			visited[n]=nodeList[n];
			return traversal(nodeList[n],visited);
		}
	}

}

function traversal(node,visited){
	var sourceList=node.sourceList;

	for(n in sourceList){
		if(typeof visited[n]!='undefined'){
			return false;
		}
		else{
			visited[n]=node;
			return traversal(sourceList[n],visited);
		}
	}
	return true;
}

function fatt(v0,v){
	v0 = parseFloat(v0);
	v = parseFloat(v);
	return v0*(1-v);
}

function fsupp(v0,v){
	v0 = parseFloat(v0);
	v = parseFloat(v);
	return v0+v-v*v0;
}

function g(v0,va,vs){

	if (typeof vs === 'undefined' && !(typeof va === 'undefined')){
		return va;
	}
	else if (typeof va === 'undefined' && !(typeof vs === 'undefined')){
		return vs;
	}
	else if(typeof vs === 'undefined' && typeof va === 'undefined'){
		return v0;
	}
	else {
		return (va+vs)/2;
	}

}

function computeAllValues(message){

	if(!checkIfTree()){
		bootbox.alert('<h3>This is not a decision tree.</h3>');
		return;
	}

	for (var n in nodeList){
		var result = SF(nodeList[n]);
		var nresult = Math.round(result * Math.pow(10,decimals)) / Math.pow(10,decimals);
//		alert(nodeList[n].name+": "+nresult);
		editComputedValue(nodeList[n], nresult);
	}

	if(message){
		var answerList=[];

		for(var n in nodeList){
			if(nodeList[n].type=='answer'){
				answerList.push(nodeList[n]);
			}
		}

		rankNodes(answerList);
	}

}

function Fatt(v0,S){

	if (S.length==0){
		var nil;
		return nil;
	}
	// Extreme value behavior.
	else if (v0==0){
		return 0;
	}
	else if (S[S.length]==0){
		S.pop();
		return Fatt(v0,S);
	}
	else if (S[S.length]==1){
		return 0;
	}
	else if (S.length==1){
//		alert("S[0]: "+S[0]);
		var fat = fatt(v0, S[0]);
//		alert("Recursion foot here: " + fat);
		return fat;
	}
	else {
		var vn = S.pop();
//		alert(vn);
		var fat = fatt(Fatt(v0,S),vn);
//		alert("fatt: " + fat);
		return fat;
	}

}

function Fsupp(v0,S){


	if (S.length==0){
		var nil;
		return nil;
	}
	// Extreme value behavior.
	else if (v0==1){
		return 1;
	}
	else if (S[S.length-1]==0){
		S.pop();
		return Fatt(v0,S);
	}
	else if (S[S.length-1]==1){
		return 1;
	}
	else if (S.length==1){
//		alert("S[0]: "+S[0]);
		var fsu = fsupp(v0, S[0]);
//		alert("Recursion foot here: " + fat);
		return fsu;
	}
	else {
		var vn = S.pop();
//		alert(vn);
		var fsu = fsupp(Fsupp(v0,S),vn);
//		alert("fatt: " + fat);
		return fsu;
	}

}

function SF(a){

	var Rs = a.getSupporters();
	var Ra = a.getAttackers();

	var msg = "";

	for (var i = 0; i<Rs.length; i++){
		msg += Rs[i].name + "\n";
	}

//	alert("Supporters: " + msg);

	var msg = "";

	for (var i = 0; i<Ra.length; i++){
		msg += Ra[i].name[i];
	}

//	alert("Attackers: " + msg);

	var FSseqSupp = [];

	for (var i = 0; i<Rs.length; i++){
		FSseqSupp.push(SF(Rs[i]));
	}

	var FSseqAtt = [];

	for (var i = 0; i<Ra.length; i++){
		FSseqAtt.push(SF(Ra[i]));
	}

//	alert("FSseqSupp for " + a.name + " : " + FSseqSupp.toString());
//	alert("FSseqAtt for " + a.name + " : " + FSseqAtt.toString());

	return g(a.baseValue, Fatt(a.baseValue, FSseqAtt), Fsupp(a.baseValue, FSseqSupp));


}

function rankNodes(nodes){
	var sorted = nodes.sort(function(a,b){return b.computedValue-a.computedValue});

	var msg='<h3>Answer ranking</h3><ul>';
	var counter=0;
	var rank=[];
	for(var n in nodes){

		
		if(typeof rank[nodes[n].computedValue]==='undefined'){
			counter++;
			rank[nodes[n].computedValue]=nodes[n].name;
		}
		msg+='<li><b>'+counter+'. '+nodes[n].name+': '+nodes[n].computedValue+'</b></li>';

	}
	msg+='</ul>';
	bootbox.alert(msg);
}