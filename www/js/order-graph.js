function orderGraph(){

	var width = parseInt($(".diagram").css("width"),10);
	var height = parseInt($(".diagram").css("height"),10);

	var msg = "";

	var top = $(".diagram").position().top+5;
	var left = $(".diagram").position().left+5;

	var elementWidth = parseInt($(".item").css("width"),10);
	var elementHeight = parseInt($(".item").css("height"),10);


	for (var j in nodeList) {
		


		var id = nodeList[j].id;
		var type = nodeList[j].type;

		var element = $('#'+id);


		element.css({top:top+'px'});
		element.css({left:left+'px'});

		left += elementWidth+5;

		if (left>width) {
			left = $(".diagram").position().left+5;
			top += elementHeight+5;
		}

	}


}