$(document).ready(function(){
  console.log('paginate_page loaded!!!');
  var limit = 5;
  var counter = 1;
  var btnDiv = $('#load-btn').parent();

  //define click event function
  var loadPlaces = function(){
    $('#load-btn').click(function(evt) {
      evt.preventDefault();
      var morePlaces = '';
      var btn = $(this).parent().html();

      console.log(counter);

      $(this).parent().html('<h3>Loading...</h3>');

      $.ajax({
        type: "GET",
        url: "/places/paginate-place",
        data: {
          limit: limit,
          start: (counter*limit)
        }
      }).done(function(msg){
        console.log('PAGINATE OK: ', msg);

        for (var i = 0; i < msg.length; i++) {
          var place = msg[i];
          morePlaces += '<tr><td>'+place.name+'</td>'+
            '<td>'+place.line.name+'-'+place.stop.name+'</td>'+
            '<td>'+place.distance+'</td>'+
            '<td><a href="'+place.website+'">'+place.website+'</a></td>'+
            '<td><a href="'+place.map+'">'+place.map+'</a></td>'+
            '<td>'+place.coordinates.lng+','+place.coordinates.lat+'</td>'+
            '<td>'+place.category+'</td>'+
            '<td>'+
              '<a href="/places/'+place._id+'" class="button">Show</a>'+
              '<a href="/places/'+place._id+'/edit" class="button">Edit</a>'+
              '<a href="/places/'+place._id+'/delete" class="button delete-place">Delete</a>'+
            '</td></tr>';
        };
        $('#place-tbl tbody').append(morePlaces);
        btnDiv.html(btn);
        //call function to bind in dynamically added link
        loadPlaces();

      }).fail(function(msg){
        console.log('PAGINATE NOT OK: ', msg);

        $('#place-tbl tbody').append('<tr><td>No More Data</td>/tr>');
      });

      counter++;
    });
  };

  //call the function to execute click event
  loadPlaces();
});