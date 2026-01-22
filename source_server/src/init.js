const cors = require('cors');

//Declare HTTP
const http = require('express')();

//Enable json suport
http.use(require('express').json());
//Enable cors for web
http.use(cors());
//Ports for the server
http.listen(7979, function () {
    console.log("[Drive] Listening in 7979");

    //Declaring Authentication
    const authentication = require('./authentication');
    authentication.instanciateAuthentication(http)
    console.log("[Drive] Authentication Instanciated")

    //Declaring Storage
    const storage = require("./storage");
    storage.instanciateDrive(http);
});