
angular.module("trainguideServices", []);
angular.module("uiModule", ["trainguideServices"]);
angular.module("trainguide.controllers", []);


angular.module("trainguide", ["google-maps", "trainguide.controllers"]);
