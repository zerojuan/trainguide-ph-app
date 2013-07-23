$(document).ready(function(){
  console.log('paginate_page loaded!!!');
  var limit = 5;
  var counter = 1;
  var btnDiv = $('#load-btn').parent();
  var btn = '<a href="#" class="button" id="load-btn">Load more...</a>';
  var categoryElem = $('#category');
  var selected = '';

  categoryElem.change(function(evt){
    selected = categoryElem.find('#catkey:selected').val();
    loadPlaces(selected, 0);
  });


  var clickLoad = function(){
    $('#load-btn').click(function(evt) {
      console.log(counter);
      evt.preventDefault();
      loadPlaces(selected, (counter*limit));
      counter++;
    }); 
  }

  //define event function
  var loadPlaces = function(selectedCategory, start){
    var morePlaces = '';
    btnDiv.html('<h3>Loading...</h3>');
    $.ajax({
      type: "GET",
      url: "/places/paginate-place",
      data: {
        limit: limit,
        start: start,
        category: selectedCategory
      }
    }).done(function(msg){
      console.log('PAGINATE OK: ', msg);

      if(msg.length > 0){
        for (var i = 0; i < msg.length; i++) {
          var place = msg[i];
          morePlaces += '<tr><td>'+place.name+'</td>'+
            '<td>'+place.line.name+'-'+place.stop.name+'</td>'+
            '<td>'+place.distance+'</td>'+
            '<td><a href="'+place.website+'">'+place.website+'</a></td>'+
            '<td><a href="'+place.map+'">'+place.map+'</a></td>'+
            '<td>'+place.coordinates.lng+','+place.coordinates.lat+'</td>'+
            '<td>'+place.category+'</td>'+
            '<td>'+place.subcategory+'</td>'+
            '<td>'+
              '<a href="/places/'+place._id+'" class="button">Show</a>'+
              '<a href="/places/'+place._id+'/edit" class="button">Edit</a>'+
              '<a href="/places/'+place._id+'/delete" class="button delete-place">Delete</a>'+
            '</td></tr>';
        }
        $('#no-data').remove();
        $('#place-tbl tbody').append(morePlaces); 

        btnDiv.html(btn).on('click', clickLoad());
        util.clickDelete();
      }else{
        $('#place-tbl tbody').html('<tr id="no-data"><td colspan="9">No Data</td>/tr>');
        btnDiv.html('');
      }
    }).fail(function(msg){
      console.log('PAGINATE NOT OK: ', msg);

      $('#place-tbl tbody').append('<tr id="no-data"><td colspan="9">No More Data</td>/tr>');
      btnDiv.html('');
    });
  };
});