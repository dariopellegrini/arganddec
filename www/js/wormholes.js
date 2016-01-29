function copyWormhole(srcNode){

	    $.ajax({
            type: "POST",
            url: "copy-wormhole.php",
            data: "sn="+srcNode+"&did="+thisDebateId,
//            data: "uid="+thisUserId+"&sd="+thisDebateId+"&sn="+srcNode,
            cache: false,
            success: function(dat) {

            	bootbox.alert(dat);

            }
            });

}


function pasteWormhole(dstNode){

	    $.ajax({
            type: "POST",
            url: "paste-wormhole.php",
            data: "dn="+dstNode+"&did="+thisDebateId,
//            data: "uid="+thisUserId+"&sd="+thisDebateId+"&sn="+srcNode,
            cache: false,
            success: function(dat) {
                  // Check if it's a JSON controlling if the first character is a '[' (very simple method);
                   if(dat.charAt(0)!='['){
                        bootbox.alert(dat.toString());
                  }else{
                        var obj = JSON.parse(dat);
                        $("#" + dstNode + " > .dropdown-wormholes").append("<li><a href='diagram.php?id="+obj[0].id+"&nid="+obj[0].srcnode+"'><b>"+obj[0].name+"</b> &rarr; <b>"+obj[0].srcnodename+"</b></li>");
                        $("#" + dstNode + " > .wormhole-label").fadeIn(300);
                  }

            	

            }
            });

}

function loadWormholes(){

          $.ajax({
            type: "POST",
            url: "load-wormholes.php",
            data: "",
//            data: "uid="+thisUserId+"&sd="+thisDebateId+"&sn="+srcNode,
            cache: false,
            success: function(dat) {
                  if (dat=='false') {
                        return;
                  }
                  var msg = "";
                  var obj = JSON.parse(dat);
              for (var i = 0; i < obj.length; i++) {

                  var srcDebate = obj[i].srcdebate;
                  var srcNode = obj[i].srcnode;
                  var dstDebate = obj[i].dstdebate;
                  var dstNode = obj[i].dstnode;
                  var debateName = obj[i].debatename;
                  var nodeName = obj[i].nodename;

                  if(dstDebate==null || dstNode==null){
                        return;
                  }

                  $("#" + srcNode + " > .dropdown-wormholes").append("<li><a href='diagram.php?id="+dstDebate+"&nid="+dstNode+"'><b>"+debateName+"</b> &rarr; <b>"+nodeName+"</b></li>");
                  $("#" + srcNode + " > .wormhole-label").fadeIn(300);

                  $("#" + dstNode + " > .dropdown-wormholes").append("<li><a href='diagram.php?id="+srcDebate+"&nid="+srcNode+"'><b>"+debateName+"</b> &rarr; <b>"+nodeName+"</b></li>");
                  $("#" + dstNode + " > .wormhole-label").fadeIn(300);

/*
                  $("#" + srcNode + " > .wormhole-label").attr("href","diagram.php?id="+dstDebate);
                  $("#" + srcNode + " > .wormhole-label").html(dstDebate);
                  $("#" + srcNode + " > .wormhole-label").fadeIn(300);

                  $("#" + dstNode + " > .wormhole-label").attr("href","diagram.php?id="+srcDebate);
                  $("#" + dstNode + " > .wormhole-label").html(srcDebate);
                  $("#" + dstNode + " > .wormhole-label").fadeIn(300);

                  
*/
                  // Increase interested wormhole node shadow.
                    $('#'+thisNodeId).css({
                        'box-shadow' : '0px 0px 30px',
                        'z-index' : '10'
                  });

              }

//              alert(msg);

            }
            });

}