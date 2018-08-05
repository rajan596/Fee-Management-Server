const 
    express         = require('express'),
    bodyParser      = require('body-parser'),
    morgan          = require('morgan'),

    // routers
    validateRouter  = require('./lib/routers/validate');
    paymentRouter  = require('./lib/routers/payment');
    scRouter  = require('./lib/routers/statuscheck');

    app             = express();


// setting all middlewares here
function setMiddleWares(){
    
    // logs requests
    app.use(morgan('tiny'));  

    // populates JSON body of request into req.body
    app.use(bodyParser.json());

    // ROUTERS
    app.use('/validate',validateRouter);
    app.use('/payment',paymentRouter);
    app.use('/statuscheck',scRouter);
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