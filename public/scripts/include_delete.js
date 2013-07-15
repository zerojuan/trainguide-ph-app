$(document).ready(function(){
  console.log('include_delete loaded!');

  $('.delete-place').on('click', function(evt){
    evt.preventDefault();
    if(confirm('Are you sure?')){
      var elm = $(this);
      var form = $('<form></form>');

      form.attr({
        method: "POST",
        action: elm.attr('href')
      })
      .hide()
      .append('<input type="hidden" />')
      .find('input')
      .attr({
        'name': '_method',
        'value': 'delete'
      })
      .end()
      .submit();
    }
  });
});