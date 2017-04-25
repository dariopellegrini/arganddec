var thisTableId;
var debateId;
var thisTargetId;

var idMap = [];

var initialX = 21;
var initialY = 451;

var xSpan = 250;
var ySpan = 150;

var normalizedValues;
var decimals=6;

function initMapping(element){

	var tableId = $(element).parents('.table').find('table').attr('id');



	normalizedValues=normalizeValues($('#'+tableId));



	bootbox.confirm("<h3>Insert the name of the new debate.</h3><input id='debate-input' type='text'>", function(result){
      if (result){
        var name = $('#debate-input').val();
        thisTableId = tableId;
        debateId = addSimpleDebate(name);
        matrixMapping(tableId);
        addMapping(debateId,tableId.substr(tableId.indexOf("-") + 1),"matrix");
        bootbox.confirm('<h3>Score mapping has been successful. Access the created debate?</h3>',function(result){
        	if(result){
        		window.open('diagram.php?id='+debateId,'_blank');
        	}
        });
      }
    });
}

function matrixMapping(tableId){

	var table = $('#'+tableId);
	var tableBody = table.find('tbody');
	var resultArray = [];
	var rowNum = table.find('.criteria').length;
	var colNum = table.find('.variant').length;

	var addedPro=[];
	var addedCon=[];

	var x=initialX;
	var y=initialY;

	var tableNumberId=tableId.substr(6,tableId.length);
	var issueName=$('#'+tableNumberId).html();
	var issueId=addSimpleNode(issueName,0.5,'issue',x,y);

	initialY+=ySpan;
	var y=initialY;

	for (var j=1; j<=colNum; j++){
		var answerName = getVariantName(table,0,j);
		var answerValue = parseFloat(getVariantValue(table,0,j));
		resultArray.push('\nAnswer '+answerName+' with value '+answerValue);

		var dstId = addSimpleNode(answerName,answerValue,'answer',x,y);
		addSimpleEdge(dstId,issueId);

		for (var i=1; i<=rowNum; i++){

			y += ySpan;

			var cellValue = getCellValue(table,i,j);

			var criteriaValue = normalizedValues[i-1];

		//	var criteriaValue = getCriteriaValue(table,i,j);

			var criteriaLabel = getCriteriaLabel(table,i,j);



			// Ignoring 0 cases.
			if(cellValue>0){

				if(typeof addedPro[i]=='undefined'){
					resultArray.push('\nPro '+criteriaLabel+' with value '+criteriaValue);
					resultArray.push('\nEdge from '+criteriaLabel+' to '+answerName);
					var srcId = addSimpleNode(criteriaLabel,criteriaValue,'pro',x,y);
					addedPro[i]=srcId;
					addSimpleEdge(srcId,dstId);
				}
				else {
					resultArray.push('\nEdge from '+criteriaLabel+' to '+answerName);
					addSimpleEdge(addedPro[i],dstId);
				}

			}
			else if(cellValue<0){

				if(typeof addedCon[i]=='undefined'){
					resultArray.push('\nCon '+criteriaLabel+' with value '+criteriaValue);
					resultArray.push('\nEdge from '+criteriaLabel+' to '+answerName);
					var srcId = addSimpleNode(criteriaLabel,criteriaValue,'con',x,y);
					addedCon[i]=srcId;
					addSimpleEdge(srcId,dstId);
				}
				else{
					resultArray.push('\nEdge from '+criteriaLabel+' to '+answerName);
					addSimpleEdge(addedCon[i],dstId);
				}
			}


		}

		y = initialY;
		x += xSpan;
	}

//	console.log(resultArray.toString());

}

function addSimpleDebate(name){

	var result = '';
	if (name=="") {
    name = "Unknown Debate";
};

$.ajax({
            type: "POST",
            url: "add-debate.php",
            data: "n="+name+"&dbv=0.5&p=&tv=",
            async: false,
            success: function(dat) {
            	result = dat;
            }
            });

return result;
}

function addSimpleNode(name,baseValue,type,x,y){
	var id = '';
	 $.ajax({
            type: "POST",
            url: "add-node.php",
            data: "did="+debateId+"&n="+name+"&bv="+baseValue+"&cv=a&t="+type+"&tv=&s="+"basic"+"&a=&x="+x+"&y="+y,
            async: false,
            success: function(dat) {
            	id = dat;
            }
            });

	 return id;

}

function addSimpleEdge(sourceId,targetId){
console.log("Add simple edge");
	    $.ajax({
            type: "POST",
            url: "add-edge.php",
            data: "did="+debateId+"&s="+JSON.parse(sourceId).nodeid+"&t="+JSON.parse(targetId).nodeid,
            async: false,
            success: function(dat) {
            	console.log("Edge added")
            },
            error: function(error) {
            	console.log("Error adding edge");
            }

}

function normalizeValues(table){

	var values=[];
	var rowNum = table.find('.criteria').length;
	for(var i=1; i<=rowNum; i++){
		values.push(getCriteriaValue(table,i,0));
	}

    max=Math.max.apply( Math, values )+0.01,
    min=Math.min.apply( Math, values )-0.01,
    l = values.length,
    i;

    for ( i = 0; i < l; i++ ) {
    	values[i]=(values[i]-min)/(max-min);
    	values[i]=Math.round(values[i] * Math.pow(10,decimals)) / Math.pow(10,decimals);
    }

    console.log(max+" "+min+" "+JSON.stringify(values));

    return values;

}
