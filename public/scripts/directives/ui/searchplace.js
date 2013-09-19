'use strict';

angular.module('uiModule').directive('search', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      selectedCategory : '=',
      searchStr : '=',
      onSearch : '=',
      resultPlaces : '='
    },
    link : function(scope, element){
      var KEYS = {
        ENTER : 13
      };

      scope.$watch("selectedCategory", function(newValue, oldValue){
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
            scope.searchStr = $(this).val();
            scope.$apply();
          }
        });
      });
    },
    template :
      '<div>'+
        '<div class="search-form">'+
          '<i class="icon-search"></i>'+
          '<input type="text" placeholder="Search" class="search-box">'+
        '</div>'+
      '</div>',
    replace : true
  }
});