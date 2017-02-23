function addMapping(debateId,matrixId,returnType){

	$.ajax({
            type: "POST",
            url: "add-mapping.php",
            data: "did="+debateId+"&mid="+matrixId+"&rt="+returnType,
            success: function(dat) {
                  if(returnType=="matrix"){
                        $('#'+matrixId).parents('.matrix-container').find('.mapped-graphs-list').fadeIn(300);
                        $('#'+matrixId).parents('.matrix-container').find('.mapped-graphs-list').find('ul').append(dat);
                  }
                  else if(returnType=="debate"){
                        $('.mapping-list').fadeIn(300);
                        $('.mapping-list').find('ul').append(dat);
                  }

            }
            });

}