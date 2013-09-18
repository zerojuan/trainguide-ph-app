'use strict';

angular.module('uiModule').directive('tips', function(){
  return {
    restrict : 'E',
    transclude : true,
    scope : {
      title : '@'
    },
    template :
      '<div>'+
        '<h6>{{title}}</h6>'+
        '<div ng-switch on="title">'+
          '<div ng-switch-when="Ticketing" class="tips">'+
            '<p>The MRT and LRT use magnetic cards that are bought at ticket windows. Both single journey tickets and Stored Value Tickets (SVT) worth 100 Pesos can be bought.</p>'+
            '<p>Simply slip the card into the turnstile slot and pass through. SVTs deduct the right amount once you exit from the station and give you a "bonus ride" which means any amount left (from .50) entitles you to one last ride.</p>'+
            '<p>The PNR uses traditional paper tickets, bought at a ticket booth in each station.</p>'+
          '</div>'+
          '<div ng-switch-when="Time" class="tips">'+
            '<p>Trains are packed during rush hour (6-8:30AM and 5:30-8PM) so schedule your trips around that time. Weekends are usually less crowded.</p>'+
            '<p>In the large stations, ticket lines can take up to 20 minutes of your time, and security checks only make it longer. Get an SVT to skip the ticket line and save time. If SVTs aren\'t available, buy two tickets to your destination, one for going, and one for returning.</p>'+
            '<p>PNR trains start running around 5:05, then arrive every 30 min. Arriving a little earlier than scheduled is a good idea. On Sundays the trains run every hour.</p>'+
          '</div>'+
        '</div>'+
      '</div>',
    replace : true
  }
});