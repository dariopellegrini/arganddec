var decimals=6;
function matrixComputation(element){

	var tableId = $(element).parents('.table').find('table').attr('id');
	var table = $('#'+tableId);

	var rowNum = table.find('.criteria').length;
	var colNum = table.find('.variant').length;

	var tableBody = table.find('tbody');
	var resultArray = [];

	var msg = '<td>Result</td>';

	for (var j=1; j<=colNum; j++){
		var result = 0;
		var variantValue=getVariantValue(table,0,j);
		var proValues=[];
		var conValues=[];
		for (var i=1; i<=rowNum; i++){

			var criteriaValue = getCriteriaValue(table,i,j);
			var cellValue = getCellValue(table,i,j);
			if(cellValue>0){
				proValues.push(criteriaValue);
			}
			else if(cellValue<0){
				conValues.push(criteriaValue);
			}

			//msg += cellValue + " " + criteriaWeight + "\n";

			result += (cellValue*criteriaValue);

		}
		// result=matrixQuadArc(variantValue,proValues,conValues);
		resultArray.push(result.toFixed(decimals));
		msg += '<td data-row='+(rowNum+2)+' data-col='+j+'>'+result.toFixed(decimals)+'</td>';
	}

	tableBody.find('.result-row').html(msg);
	tableBody.find('.rank-row').html('<td>Ranks</td>'+computeRanking(resultArray));
}

// Row i and col j.
function getCellValue(table,i,j){

	var element = table.find('[data-row='+i+'][data-col='+j+']').find('.dropdown-div').html();
	if(element=='0'){
		return '0';
	}
	else if(element=='+'){
		return '1';
	}
	else if(element=='-'){
		return '-1';
	}

}

function getVariantValue(table,i,j){
	return table.find('[data-row='+i+'][data-col='+j+']').find('.variant-value').html();
}

// Row i and col j (not useful now).
function getCriteriaValue(table,i,j){

	return table.find('[data-row='+i+'][data-col='+0+']').find('.criteria-value').html();

}
function getCriteriaLabel(table,i,j){

	return table.find('[data-row='+i+'][data-col='+0+']').find('.criteria-label').html();

}


function computeRanking(array){
	var sorted = array.slice().sort(function(a,b){return b-a});
	var ranks = array.slice().map(function(v){ return sorted.indexOf(v)+1 });
	var msg = '';
	for (var i=0; i<ranks.length; i++){
		var rank = ranks[i];
		msg += '<td data-row='+rowNum+' data-col='+(i+1)+'>'+rank+'</td>';
	}

	return msg;
}

// Row i (not useful now) and col j.
function getVariantName(table,i,j){

	return table.find('[data-row='+0+'][data-col='+j+']').find('.variant-label').html();

}

function matrixQuadArc(baseValue,proValues,conValues){

	var proMultiply=1,
		conMultiply=1;

	for(var i=0; i<proValues.length; i++){
		proMultiply*=(1-proValues[i]);
	}

	for(var j=0; j<conValues.length; j++){
		conMultiply*=(1-conValues[j]);
	}

	var resultPro=proValues.length!=0 ? 1-(1-baseValue)*proMultiply : null;
	var resultCon=conValues.length!=0 ? baseValue*conMultiply : null;

	return g(baseValue,resultCon,resultPro);

}

function g(v0,va,vs){

	console.log(va+" "+vs);

	if (vs==null && va!=null){
		return va;
	}
	else if (vs!=null && va==null){
		return vs;
	}
	else if(vs==null && va==null){
		return v0;
	}
	else {
		return (va+vs)/2;
	}

}