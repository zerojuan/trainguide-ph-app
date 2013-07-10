
@ECHO OFF

set MONGOHQ_URL=mongodb://localhost.com/mongodb

ECHO Starting Trainguide...
nodemon --debug app.js