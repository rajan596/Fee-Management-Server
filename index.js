const 
    express         = require('express'),
    bodyParser      = require('body-parser'),
    morgan          = require('morgan'),

    app             = express();


// setting all middlewares here
function setMiddleWares(){
    
    // logs requests
    app.use(morgan('tiny'));  
}

function startServer(){
    var server=app.listen(7123, function (err){
        if(err) {
            console.err("Problem in starting server");
        }
        else {
            console.log("Server Started on Port ", server.address().port);
        }
    });
}

//================================

setMiddleWares();
startServer();