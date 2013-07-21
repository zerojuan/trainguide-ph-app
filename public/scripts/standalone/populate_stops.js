$(document).ready(function(){
  console.log('populate_stops loaded!');

  var stationElem = $("#line");
  var stopElem = stationElem.parent().find("span");
  stationElem.change(function(evt){
    var selected = stationElem.find("#stnkey:selected").val();
    // console.log(selected);
    // stopElem.html(selected);
    populateStops(selected);
  });

  var populateStops = function(selectedLine){
    $.ajax({
      type: "GET",
      url: "/places/station-stops",
      data: {
        selectedStn: selectedLine
      }
    }).done(function(msg){
      console.log("POPULATE OK ", msg);
      var selectStr = '<select name="stop" id="stop" required>'+
                        '<option value="">-- Select Stop-- </option>';
      for(var i = 0; i < msg.length; i++){
        var selected = '';
        if(window.selectedStop && window.selectedStop == msg[i].name){
          selected = 'selected';
        }
        selectStr+='<option id="val" value="'+msg[i].stop_id+'" '+selected+'>'+msg[i].name+'</option>';
      }
      selectStr+='</select>';
      stopElem.html(selectStr);
    }).fail(function(msg){
      console.log("POPULATE NOT OK ", msg);
    });
  }

  if(window.selectedStop){
    console.log("Searching for...", window.selectedLineId);
    populateStops(window.selectedLineId);
  }
  // console.log(stopElem);
});