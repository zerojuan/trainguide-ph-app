$(document).ready(function(){
  console.log('populate_stops loaded!');

  var stationElem = $("#station");
  var stopElem = stationElem.parent().find("span");
  stationElem.change(function(evt){
    var selected = stationElem.find("#stnkey:selected").val();
    // console.log(selected);
    // stopElem.html(selected);

    $.ajax({
      type: "GET",
      url: "/places/station-stops",
      data: {
        selectedStn: selected
      }
    }).done(function(msg){
      console.log("POPULATE OK ", msg);
      stopElem.html(msg);
    }).fail(function(msg){
      console.log("POPULATE NOT OK ", msg);
    });
  })
  // console.log(stopElem);
});