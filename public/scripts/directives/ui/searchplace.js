'use strict';

angular.module('uiModule').directive('search', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      onSearch : '=',
      resultPlaces : '='
    },
    link : function(scope, element){
      var KEYS = {
        ENTER : 13
      };

      $(".search-box").focus(function() {
        $(this).animate({ width: '200px' }, "fast");
        $('h2.place').hide("fast");
        $('h2.place span').hide("fast");
      }).blur(function() {
        $(this).animate({ width: '100px' }, "fast");
        $('h2.place').show("fast");
        $('h2.place span').show("fast");
      }).keyup(function(evt){
        if (evt.keyCode === KEYS.ENTER) {
          var qry = {
            queryStr : $(this).val()
          };
          if($(this).val() != '' || $(this).val() != this.value){
            $('.categories-list h6').text('Results');  
            scope.onSearch(qry);
          }else{
            $('.categories-list h6').text('Featured'); 
            scope.resultPlaces = [];
            scope.$apply();
          }
        }
      });
    },
    template :
      '<div>'+
        '<h2 class="place">Places <span> to go</span></h2>'+
        '<div class="search-form">'+
          '<i class="icon-search"></i>'+
          '<input type="text" placeholder="Search" class="search-box">'+
        '</div>'+
      '</div>',
    replace : true
  }
});