'use strict';

if (process.env.NODE_ENV !== 'dev' &&
    process.env.NODE_ENV !== 'prod' &&
    process.env.NODE_ENV !== 'test'
    ) {

    console.log(
    `Please specify one of the following environments to run your server
            - test
            - dev
            - prod

            
    Example : NODE_ENV=dev pm2 start app.js`
    );
    throw 'abc';
    return '';

}


process.env.NODE_CONFIG_DIR = __dirname + '/config/';

/** Node Modules **/
const config = require('config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const colors = require('colors');
const logger = require('./libs/logging');
const logconf = {};

const updater = require('./routes/updater');

/** Routes **/
const ico = require('./routes/ico');
const scam = require('./routes/scam');
const report = require('./routes/report');
const wrapper = require('./routes/wrapper');

/** Socket **/
// const socket = require('./routes/socket');


const app = express();

app.set('port', process.env.PORT || config.get('port'));
// app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.set('views','./src/views');
// app.set('view engine','ejs');	

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


/**--------------------------------------------------------
 *  API to check if server is running or not
 *---------------------------------------------------------
 */

app.get('/ping', function (req, res) {
    res.send(200, {}, { pong: true });
});

// app.get('/', (req, res)=>{
//     res.render('home.ejs');
// });


//ICO APIs
app.get('/api/ico', ico.allICO);

// Scam APIs
app.get('/api/scam/analysis', scam.analysis);


app.post('/api/report/insert', report.insert);

// API wrapper
app.get('/api/wrapper', wrapper.apiWrapper);

// app.get('/editor/:editorName', editor.initialize);

// app.post('/editor/:editorName',  editor.initialize);
// app.get('/users/:editorName', editor.getUserList);


var httpsServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});    

