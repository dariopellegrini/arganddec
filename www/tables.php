<?php
$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

include "dbUtilities.php";

$connection=dbConnect();

if (!isset($_SESSION['id'])) {
  header("Location: index.php");
  die();
}

$id = $_SESSION['id'];

$sql = mysql_query("Select * From users Where id='$id'") or die(mysql_error());

while ($s = mysql_fetch_array($sql)) {
  $id = $s['id'];
  $name = $s['username'];
}

$matrixid=$_GET['id'];

mysql_close($connection);

?>
<!DOCTYPE html>
<html lang="en">
<title>Tables</title>
  <head>
        <script src="js/jquery-1.11.1.js"></script>
        <script src="js/go-debug.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
        <script src="jsPlumb-master/dist/js/dom.jsPlumb-1.6.4.js"></script>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">
        <!-- Latest compiled and minified JavaScript -->
        <script src="js/bootstrap.min.js"></script>
        <script src="js/bootbox.min.js"></script>

        <script src="js/matrix.js"></script>
        <script src="js/matrix-computation.js"></script>
        <script src="js/matrix-mapping.js"></script>

        <script src="js/mapping-manager.js"></script>

        <style type="text/css">

th,td {
  text-align: center;
  width: 50px;
}

td {
  width: 50px;
}

#criteria {
  width: 150px;
}

.glyphicon-plus{
  color: green;
}

i.glyphicon-trash{
  color: red;
}

.add-cell, .delete-cell{
  background-color: white;
  cursor: pointer;
}

.dropdown-matrix{
  position: absolute;
  left: 48%;
  top: 48%;
}
    </style>


  <div id="debate-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
        <h4 class="modal-title" style="color: white;"></h4>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

  <div id="access-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
        <h4 class="modal-title" style="color: white;"></h4>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->




<script>



var cellHTML1 = '<div class="btn-group"><div class="cell dropdown-div" data-toggle="dropdown" aria-expanded="false" style="cursor: pointer;">0</div><ul class="dropdown-menu" role="menu"><li><a style="cursor: pointer;" onClick="setCellValue(this)">0</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">+</a></li><li><a style="cursor: pointer;" onClick="setCellValue(this)">-</a></li></ul></div>';
var rowNum = 0;
var colNum = 0;


  function addVariant(element){
    var table = $(element).parents('.table');

    var rowNum = table.find('.criteria').length+1;
    var colNum = table.find('.variant').length+1;


    bootbox.confirm("<h3>Insert the name of the new variant.</h3></hr><input id='variant-input-name' type='text' /><br><br><input id='variant-input-weight' type='text' placeholder='Disabled for now.' disabled/>", function(result){
      if (result){
        var name = $('#variant-input-name').val();
        var weight = $('#variant-input-weight').val();

        if(weight==''){
          weight=0.5;
        }

        var colspan = table.find('#variant-title').attr('colspan');
        colspan++;
        table.find('#variant-title').attr('colspan',colspan);
        table.find('#add-variant').before('<th class="variant" data-field="variant-'+name+'" data-label="'+name+'" data-value='+weight+' data-row='+0+' data-col='+colNum+' data-toggle="popover" tabindex="0" data-trigger="focus" style="cursor: pointer;"><div class="variant-label">'+name+'</div><div class="variant-value">'+weight+'</div></th>');
        table.find('.effect-row').each(function(index){
          $(this).find('.delete-cell').before('<td data-row='+(index+1)+' data-col='+colNum+'>'+cellHTML1+'</td>');
        });
        table.find('#modifiers-row').append('<td id="delete-variant" class="delete-cell" data-field="delete-criteria" data-row="'+rowNum+'" data-col="'+colNum+'" onClick="deleteVariant(this)"><i class="glyphicon glyphicon-trash"></i></td>')

        initPopover();
      }
    });

  }

  function addCriteria(element){
    var table = $(element).parents('.table');

    var rowNum = table.find('.criteria').length+1;
    var colNum = table.find('.variant').length+1;


    bootbox.confirm("<h3>Insert the name and the weight of the new criteria.</h3><input id='criteria-input-name' type='text' placeholder='Name'><br><br><input id='criteria-input-weight' type='text' placeholder='Weight (default 0.5)'>", function(result){
      if (result){
        var name = $('#criteria-input-name').val();
        var weight = $('#criteria-input-weight').val();

        if (weight==''){
          weight = 0.5;
        }

        if (isNaN(weight)){
          bootbox.alert('The weight inserted is not a number.')
        }
        else {


        var colsNumber = table.find('.variant-row > *').length-2; // Number of cols - title and +.

        var msg = '<tr class="effect-row" data-field="criteria-'+name+'"><td class="criteria" data-row='+rowNum+' data-col='+0+'><div class="criteria-label">'+name+'</div><div class="criteria-value">'+weight+'</div></td>';
        for (var i = 0; i<colsNumber; i++){
          msg += '<td data-row='+rowNum+' data-col='+(i+1)+'>'+cellHTML1+'</td>';
        }
        msg += '<td id="delete-effect" class="delete-cell" data-field="delete-criteria" data-row="'+rowNum+'" onClick="deleteCriteria(this)"><i class="glyphicon glyphicon-trash"></i></td></tr>';

        table.find('#add-criteria').parent().before(msg);
      }

      }
    });
  }

function deleteCriteria(element){

    var table = $(element).parents('.table');

    var rowNum = table.find('.criteria').length+1;
    var colNum = table.find('.variant').length+1;

    // Selection of all those elements with data-row>element's data-row attribute.
    var elements = $('td').filter(function() {
    return  $(this).attr('data-row') > $(element).attr('data-row');
});

  $(element).parent().fadeOut(100, function(){ $(this).remove(); });
  rowNum--;

    // Update of forward row values.
    elements.each(function(index){
    var newVal = $(this).attr('data-row');
    newVal--;
    $(this).attr('data-row',newVal);
  });

}

function deleteVariant(element){

  var table = $(element).parents('.table');





  var rowNum = table.find('.criteria').length+1;
  var colNum = table.find('.variant').length+1;



  // Selection of all those elements with data-col>element's data-col attribute.
    var elements = table.find('th,td').filter(function() {
    return  $(this).attr('data-col') > $(element).attr('data-col');
});

  table.find('[data-col="'+$(element).attr('data-col')+'"]').fadeOut(100, function(){ $(this).remove(); });

  // Update of forward col values.
    elements.each(function(index){
    var newVal = $(this).attr('data-col');
    newVal--;
    $(this).attr('data-col',newVal);
  });

  colNum--;
}

</script>
  </head>

  <body>

<nav class="navbar navbar-default" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header container">
      <a class="navbar-brand" href="debates.php">Debates</a>
      <a class="navbar-brand" href="tables.php">Tables</a>
      <a class="navbar-brand" href="logout.php">Logout</a>
    </div>
  </div>
    <div class="jumbotron">
  <div class="container"><h1>Tables</h1></div>
</div>
</nav>


<div id="table-container" class="container">

<button class="btn btn-default" style="width: 300px;" onClick="$('#new-table').attr('class')=='closed' ? $('#new-table').attr('class','opened').slideDown(300) : $('.opened').attr('class','closed').slideUp(300);">New table</button>
<div id="new-table" class="closed" style="display: none;"><br>
  <div class="table">
  <button class="btn btn-default save-matrix-button" onClick="saveMatrix(this)">Save the table</button><br><br>
  
    <table id="table1" class="table-striped table-bordered table-hovered table-condensed">
    <thead>

      <tr><th></th><th id='variant-title' colspan=0 style="text-align: center;">Concept variant </th></tr>
    <tr class='variant-row'>
        <th id="criteria" data-field="criteria">Selection criteria</th>
        <th id="add-variant" class="add-cell" data-field="add-variant" onClick="addVariant(this)">
            <i class="glyphicon glyphicon-plus"></i>
        </th>
    </tr>
    </thead>

    <tbody>
    <tr id="modifiers-row"> <td id="add-criteria" class="add-cell" data-field="add-criteria" onClick="addCriteria(this)">
            <i class="glyphicon glyphicon-plus"></i>
        </td>
      </tr>
      <tr class="result-row"></tr>
      <tr class="rank-row"></tr>
  </tbody>
    </table>

  </div>
</div>
<br><br><br>


</div>



<div id="prototype-table" style="display: none;"><br>
  <div class="table">
  <button class="btn btn-default" onClick="matrixComputation(this)">Compute the table</button>
  <button class="btn btn-default" onClick="initMapping(this)">Map the table</button>
  <button class="btn btn-default save-matrix-button" onClick="saveMatrix(this)">Save the table</button><br><br>
  
    <table id="table1" class="table-striped table-bordered table-hovered table-condensed">
    <thead>

      <tr><th></th><th id='variant-title' colspan=0 style="text-align: center;">Concept variant</th></tr>
    <tr class='variant-row'>
        <th id="criteria" data-field="criteria">Selection criteria</th>
        <th id="add-variant" class="add-cell" data-field="add-variant" onClick="addVariant(this)">
            <i class="glyphicon glyphicon-plus"></i>
        </th>
    </tr>
    </thead>

    <tbody>
    <tr id="modifiers-row"> <td id="add-criteria" class="add-cell" data-field="add-criteria" onClick="addCriteria(this)">
            <i class="glyphicon glyphicon-plus"></i>
        </td>
      </tr>
      <tr class="result-row"></tr>
      <tr class="rank-row"></tr>
  </tbody>
    </table>

  </div>
</div>

<script>

var thisId='<?php echo $matrixid; ?>';

</script>

  </body>
</html>
