var popoverId="Vuoto!";
$(document).ready(function(){

  initPopover();
  loadMatrices();
  loadCells(thisId);

});

function initPopover(){

  var msg = '<div class="cell-popover"> Label: <input class="label-input" type="text" /><br><br>';
    msg += 'Value: <input class="value-input" type="text" /><br>';
    msg += '<hr class="divider">';
    msg += '<button class="btn btn-default" onClick="setCell(this);">Save</button></div>';

  var refMsg = '<a style="cursor: pointer;" onClick="setReference(this)">Set as reference</a>'

  $('[data-toggle="popover"]').popover({
                placement: "auto",
                content: refMsg,
                html: true,
                container: 'body',
                });

  $('[data-toggle="popover"]').on('show.bs.popover', function () {

    popoverId = $(this).parent().attr('data-field');
  });

 //   alert($(this).attr('id') + " " + $(this).parent().attr('id'));
/*
 $('body').on('click', function (e) {
    //did not click a popover toggle or popover
    if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('.popover.in').length === 0) { 
        $('[data-toggle="popover"]').popover('hide');
    }
});
*/
}


function setCell(element){

	$('[data-field='+popoverId+']').find('#criteria-1').html($(element).parent().find('.label-input').val() + " " + $(element).parent().find('.value-input').val());
	$('[data-toggle="popover"]').popover('hide');

}

function setCellValue(element){
  $(element).parents('td').find('.dropdown-div').html($(element).html());
}

function setReference(element){
  var thisId = $(element).parent().parent().attr("id");
  var refCol = $('[aria-describedby="'+thisId+'"]').attr('data-col');

  // Set every th element color to black and remove data-ref attribute.
  $('th').css('color','black');
  $('th').removeAttr('data-ref');
  // Adding data value for identifying reference col.
  $('[aria-describedby="'+thisId+'"]').attr('data-ref','true');
  $('[aria-describedby="'+thisId+'"]').css('color','red');

  // Set every data-toggle attribute of ebery dropdown-div class element to dropdown.
  $('.dropdown-div').attr('data-toggle','dropdown');

  // Every element of the reference col will be set as 0 and with data-toggle empty.
  $('[data-col="'+refCol+'"]').find('.dropdown-div').html('0')
  $('[data-col="'+refCol+'"]').find('.dropdown-div').attr('data-toggle','');

}

function saveMatrix(element){
  var table = $(element).parents('#new-table').find('table');

  var tableJSON = [];

  table.find('tr').each(function(index){
    var row = [];
    // Variants.
    $(this).find('.variant').each(function(index){
      var item = {};
      item['label'] = $(this).find('.variant-label').html();
      item['value'] = $(this).find('.variant-value').html();
      typeof $(this).attr('data-ref') === 'undefined' ? item['ref'] = '' : item['ref'] = $(this).attr('data-ref'); // if ? then : else
      row.push(item);
    });

    // Criteria label.
    $(this).find('.criteria').each(function(index){
      var item = {};
      item['label'] = $(this).find('.criteria-label').html();
      item['value'] = $(this).find('.criteria-value').html();
      row.push(item);

    });

    // Cells.
    $(this).find('.cell').each(function(index){
      var item = {};
      item['label'] = $(this).html();
      item['value'] = $(this).attr('data-value');
      row.push(item);

    });

    if(row.length>0){
      tableJSON.push(row);
    }
  });

console.log(JSON.stringify(tableJSON));
  bootbox.confirm('<h3> Insert a name for the score.</h3><br><input type="text" id="input-matrix" class="form-control" placeholder="Matrix"/>', function(result){

    if(result){
    var matrixName = $('#input-matrix').val();



    $.ajax({
            url: "add-matrix.php",
            type: "POST",
            data: {
              name: matrixName,
              table: tableJSON
            },
            success: function (dat) {
              $('#table-container').append(dat)

            }
        });

          }

     });

}

function loadMatrices(){

      $.ajax({
            url: "load-matrices.php",
            type: "POST",
            data: '',
            async: false,
            success: function (dat) {
                $('#table-container').append(dat);
            }
        });
}

function loadCells(matrixId){

  $('.dropdown-matrix').slideUp(300);
  $('.matrix-container').find('.btn').attr('class','btn btn-default');
  $('#'+matrixId).attr('class','btn btn-info');
      $.ajax({
            url: "load-cells.php",
            type: "POST",
            data: "mid="+matrixId,
            async: false,
            success: function (dat) {
              $('#'+matrixId).parents('.matrix-container').find('.dropdown-matrix').hide().html('<br>'+$("#prototype-table")[0].innerHTML).slideDown(300);
              $('#'+matrixId).parents('.matrix-container').find('table').attr('id','table-'+matrixId);
              $('#'+matrixId).parents('.matrix-container').find('.save-matrix-button').attr('onClick','updateMatrix('+matrixId+')');

              var obj = JSON.parse(dat);
              var msg = "";

              for (var i = 0; i < obj.length; i++) {

                  var label=obj[i].label;
                  var value=obj[i].value;
                  var ref=obj[i].ref;
                  var type=obj[i].type;
                  var row=parseInt(obj[i].row);
                  var column=parseInt(obj[i].column);

                  if(type=='variant'){
                    var colspan = $('#table-'+matrixId).find('#variant-title').attr('colspan');
                    colspan++;

                    var color = ref ? 'red' : 'black';

                    $('#table-'+matrixId).find('#variant-title').attr('colspan',colspan);
                    $('#table-'+matrixId).find('#add-variant').before('<th class="variant" data-field="variant-'+label+'" data-label="'+label+'" data-value='+value+' data-row='+0+' data-col='+(column+1)+' data-toggle="popover" tabindex="0" data-trigger="focus" data-ref="'+ref+'" style="cursor: pointer; color:'+color+';"><div class="variant-label">'+label+'</div><div class="variant-value">'+value+'</div></th>');
                    $('#table-'+matrixId).find('#modifiers-row').append('<td id="delete-variant" class="delete-cell" data-field="delete-criteria" data-row="'+0+'" data-col="'+(column+1)+'" onClick="deleteVariant(this)"><i class="glyphicon glyphicon-trash"></i></td>');
                  }
                  else if(type=='criteria'){
                    $('#table-'+matrixId).find('#add-criteria').parent().before('<tr class="effect-row" data-field="criteria-'+label+'"><td class="criteria" data-row='+row+' data-col='+0+'><div class="criteria-label">'+label+'</div><div class="criteria-value">'+value+'</div></td><td id="delete-effect" class="delete-cell" data-field="delete-criteria" data-row="'+row+'" onClick="deleteCriteria(this)"><i class="glyphicon glyphicon-trash"></i></td></tr>');
                  }
                  else if(type=='cell'){
                    var cellHTML1;
                    if(checkForDescendants(value)=='true' && label!='0'){
                      cellHTML1 = '<div  class="btn-group"><div class="cell dropdown-div" data-value="'+value+'" data-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">'+label+'</div><ul class="dropdown-menu" role="menu"><li><a style="cursor: pointer;" onClick="setCellValue(this)">0</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">+</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">-</a></li><li><a data-descendants="'+value+'" style="cursor: pointer;" onClick="showDescendants(this)">Descendants</a></li></ul></div>';
                    }
                    else {
                      cellHTML1 = '<div  class="btn-group"><div class="cell dropdown-div" data-value="'+value+'" data-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">'+label+'</div><ul class="dropdown-menu" role="menu"><li><a style="cursor: pointer;" onClick="setCellValue(this)">0</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">+</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">-</a></li></ul></div>';
                    }

                    $('#table-'+matrixId).find('[data-row="'+row+'"]').parents(".effect-row").find('#delete-effect').before('<td data-row='+(row)+' data-col='+(column)+'>'+cellHTML1+'</td>');
                  }

              }

              initPopover();

            }
        });

}

function updateMatrix(id){

  $('.dropdown-matrix').slideUp(300);

  var table = $('#'+id).parents('.matrix-container').find('table');

  var tableJSON = [];

  table.find('tr').each(function(index){
    var row = [];
    // Variants.
    $(this).find('.variant').each(function(index){
      var item = {};
      item['label'] = $(this).find('.variant-label').html();
      item['value'] = $(this).find('.variant-value').html();
      typeof $(this).attr('data-ref') === 'undefined' ? item['ref'] = '' : item['ref'] = $(this).attr('data-ref'); // if ? then : else
      row.push(item);
    });

    // Criteria label.
    $(this).find('.criteria').each(function(index){
      var item = {};
      item['label'] = $(this).find('.criteria-label').html();
      item['value'] = $(this).find('.criteria-value').html();
      row.push(item);

    });

    // Cells.
    $(this).find('.cell').each(function(index){
      var item = {};
      item['label'] = $(this).html();
      item['value'] = $(this).attr('data-value');
      row.push(item);

    });

    if(row.length>0){
      tableJSON.push(row);
    }
  });

//  alert(JSON.stringify(tableJSON));

    $.ajax({
            url: "add-matrix.php",
            type: "POST",
            data: {
              id: id,
              table: tableJSON
            },
            success: function (jsonStr) {
            //    alert(JSON.stringify(jsonStr));
                loadCells(id);
            }
        });

}

function deleteMatrix(id){

  bootbox.confirm('<h3>Delete score '+$('#'+id).html()+'?</h3>', function(result){

    if(result){

          $.ajax({
            url: "delete-matrix.php",
            type: "POST",
            data: "id="+id,
            success: function (dat) {
            //    alert(JSON.stringify(jsonStr));
                $('#'+id).parents('.matrix-container').fadeOut(300);
            }
        });

    }

  });

}

function showDescendants(element){

  var id=$(element).attr('data-descendants');
  var effectName=$(element).parents('.effect-row').find('.criteria-label').html();
  var matrixId = $(element).parents().find('.matrix-container').find('button').first().attr('id');

            $.ajax({
            url: "load-descendants.php",
            type: "POST",
            data: "tid="+id+"&mid="+matrixId,
            success: function (dat) {
                var obj = JSON.parse(dat);

                console.log(JSON.stringify(obj));

                htmlDescendants="";


                bootbox.alert("<h3>"+effectName+"'s descendants</h3><div data-node=0></div>");
                printDescendants(obj,0,0);
                $('[data-node="0"]').children('div').children('div').css('display','none');
            }
        });

}

function printDescendants(element,parent,counter){

  if(typeof element.length==='undefined') return;

/*
  if(element.length==0) return;

  if(typeof element.length!='undefined'){


    c++;

    $('.level[data-level="'+(c-1)+'"]').append("<div><div class='level' data-level='"+c+"' style='padding-left:"+c*20+"px;'></div></div>");
*/
    for(var i=0; i<element.length; i++){

    if(Array.isArray(element[i])){
      printDescendants(element[i],element[i-1].name,counter+7);
      $('[data-node="'+element[i-1].name+'"]').children('div').css('display','none');
    }
    else{
//      alert("Print single."+ element[i].name+" in "+parent+".");
    var singleHtmlDescendants="<div data-node='"+element[i].name+"' style='padding-left:"+counter+"px;'><a onClick='expandSelection(this)' style='cursor:pointer;'>+</a><b><font color="+pickTheColor(element[i].type)+">"+element[i].name+" ["+element[i].computedvalue+"]</font></b></div>";
    $('[data-node="'+parent+'"]').append(singleHtmlDescendants);
    }


      
    }


}

function pickTheColor(type){
      if (type=='issue') {
        return '#428BCA';
    }
    else if (type=='answer') {
        return '#E3972F';
    }
    else if (type=='pro') {
        return '#53AD54';
    }
    else if (type=='con') {
        return '#D24642';
    }

}

function expandSelection(element){

  if($(element).html()=='+'){
    $(element).html('-');
    $(element).parent().children('div').slideDown(100);
}
else if($(element).html()=='-'){
    $(element).html('+');
    $(element).parent().children('div').slideUp(100);
  }
}

  function checkForDescendants(id){
//    alert(id);
    var result;
          $.ajax({
            url: "search-sons.php",
            type: "POST",
            data: "tid="+id,
            async: false,
            success: function (dat) {

              result=dat;

            }
          });
          return result;
}