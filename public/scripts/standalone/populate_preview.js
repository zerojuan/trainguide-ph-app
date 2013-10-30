$(document).ready(function(){
  console.log('populate_preview loaded!');
  console.log('method', formMethod, 'action', formAction);
  
  $('#input-place').submit(function(evt){
    evt.preventDefault();
    var previewElem = $('#preview-div');
    var placeArray = $(this).serializeArray();
    var place = {};

    for(input in placeArray){
      place[placeArray[input].name] = placeArray[input].value;
    }
    // console.log('PLACE: ', place);

    $.ajax({
      type: "POST",
      url: "/places/preview",
      data: {
        place: place,
        formMethod: formMethod,
        formAction: formAction
      }
    }).done(function(msg){
      console.log("PREVIEW OK ", msg);
      previewElem.html(msg);

      cancelClick();
    }).fail(function(msg){
      console.log("PREVIEW NOT OK ", msg);
    })
  });

  var cancelClick = function(){
    $('#cancel').click(function(evt){
      evt.preventDefault();
      $('#preview-div').html('');
    });
  };
});