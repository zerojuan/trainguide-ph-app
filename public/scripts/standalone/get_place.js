$(document).ready(function(){
  console.log('get_place loaded!!!');

  $('#search-form').submit(function(evt){
    evt.preventDefault();
    var query = $('.search-input').val();
    var search = $('#search-div');

    console.log('val: ', query);
    $.ajax({
      type: "GET",
      url: "/places/search-place",
      data: {
        queryStr: query
      }
    }).done(function(msg){
      console.log('SEARCH OK ', msg);
      search.html(msg);
      util.clickDelete();
    }).fail(function(msg){
      console.log('SEARCH NOT OK ', msg);
    });

  });
});