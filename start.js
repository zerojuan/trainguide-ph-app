
var createApp = require('./app.js'),
    http = require('http');

function startServer(app){
    http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
}


startServer(createApp(process.env));