
@ECHO OFF

set MONGO_URI=mongodb://localhost.com/mongodb

ECHO Starting Trainguide...
nodemon --debug app.js