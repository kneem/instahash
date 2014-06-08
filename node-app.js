/**
 * Instahash
 *
 * Copyright 2014 Nima Dehnashi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require('express');
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    http = require('http'),
    routes = require('./routes/index'),
    port = Number(process.env.PORT || 3000),
    app = module.exports = express();
    server = require('http').createServer(app);

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.engine('html', cons.handlebars);

// view engine setup
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(__dirname));
//app.use(favicon(__dirname + '/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, 'app/partials')));
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = app.get('port');
server.listen(port, function() {
    console.log('Listening on port: ' + port);
});
