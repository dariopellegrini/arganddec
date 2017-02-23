var labelLength = 6000000;

function clickLabel(element){
	var parentId = element.parentNode.id;
	$('#'+parentId+'> #name').css('display', 'none');
    $('#'+parentId+'> #name_entry')
        .val($('#'+parentId+'> #name').attr("title"))
        .css('display', '')
        .focus();

}

function blurLabel(element){
	var parentId = element.parentNode.id;
	$('#'+parentId+'> #name_entry').css('display', 'none');

    


    var text = $('#'+parentId+'> #name_entry').val();

    if (text.length>labelLength) {
    	text = text.substring(0,labelLength-1)+"...";
    };

    $('#'+parentId+'> #name')
        .text(text)
        .attr("title", $('#'+parentId+'> #name_entry').val())
        .css('display', '');

    // Modifing node information.
    nodeList[parentId].name = $('#'+parentId+'> #name_entry').val();

    var thisNode = nodeList[parentId];

        $.ajax({
            type: "POST",
            url: "edit-node.php",
            data: "id="+parentId+"&n="+$('#'+parentId+'> #name_entry').val()+"&bv="+thisNode.baseValue+"&cvq="+thisNode.computedValueQuad+"&tv="+thisNode.typeValue+"&s="+thisNode.state+"&a="+thisNode.attachment,
            cache: false,
            success: function(dat) {
            }
            });
}