
angular.module("trainguideServices", []);
angular.module("uiModule", ["trainguideServices"]);
angular.module("trainguide.controllers", ["trainguideServices"]);


angular.module("trainguide", ["google-maps", "trainguide.controllers", "uiModule"]);
