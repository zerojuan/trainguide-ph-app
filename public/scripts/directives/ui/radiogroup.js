/**
 * Created with JetBrains WebStorm.
 * User: Julius
 * Date: 7/12/13
 * Time: 7:04 AM
 */
angular.module('uiModule').directive('radioGroup', [function(){
  return {
    restrict : 'E',
    transclude : true,
    template : 
      '<div>'+
      '<ul>' +
        '<li ng-repeat="i in menuItems">'+
          '<a ng-click="navClick(i)" ng-class="{active:i.selected}" href="#{{i.title}}"><span>{{i.title}}</span></a>'+
        '</li>'+
      '</ul>'+
      '</div>',
    scope : {
      menuItems : '=menuItems',
      selectedItemHandler : '&selectedItemHandler',
      selectedItem : '=selectedItem',
      showDetails : '=showDetails'   
    },                
    link: function(scope, elm, attr, ctrl){  
    console.log("Hello world");   
      scope.previousItem = null;      
      scope.navClick = function(item){        
        console.log("Previous Item: ", scope.previousItem);
        for(var i in scope.menuItems){
          if(scope.menuItems[i].title == item.title){
            scope.menuItems[i].selected = !scope.menuItems[i].selected;
          }else{
            scope.menuItems[i].selected = false;
          }
         }
        // if(scope.previousItem){
        //  scope.previousItem.selected = false;                    
        //  if(scope.previousItem.title == item.title){
        //    item.selected = true;
        //    scope.previousItem = null;
        //  }else{
        //    scope.previousItem = item;
        //  }
        // }else{
        //  scope.previousItem = item;  
        // }

        //item.selected = !item.selected;       
        scope.selectedItemHandler();        

        scope.showDetails = false;
        // console.log('radiogroup.js navClick showDetails', scope.showDetails);
      }

      // scope.$watch("selectedItem", function(newValue, oldValue){
      //   console.log("Changed Selected Item...", newValue);
                
      //   if(newValue){
      //     if(newValue.stop){
      //       for(var i in scope.menuItems){
      //         if(scope.menuItems[i].title == newValue.title){
      //           scope.menuItems[i].selected = newValue.selected;
      //         }else{
      //           scope.menuItems[i].selected = false;
      //         }
      //       }   
      //     }         
      //   }      

      //   // console.log('radiogroup.js selectedItem showDetails', scope.showDetails);
      // });
    },
    replace: true
  }
}]);