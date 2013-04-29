/*
 * couch-proxy-experiment
 * https://github.com/null2/couch-proxy-experiment
 *
 * Copyright (c) 2013 Johannes J. Schmidt, null2 GmbH
 * Licensed under the MIT license.
 */

'use strict';

var restify = require('restify');
var request = require('request');
var url = require('url');

exports.listen = function(options, fn) {
  options = options || {};
  options.port = options.port || 80;
  options.url = options.url || 'http://localhost:5984';
  options.auth = options.auth || {};

  var server = restify.createServer();
  var couch = request.defaults({ auth: options.auth });

  server.get('/', function(req, res) {
    res.send('hello, I am a couch proxy! ');
  });

  server.get(/^\/couch\/(.*)$/, function(req, res) {
    console.log('GET ' + req.params[0]);
    couch.get(url.resolve(options.url, req.params[0])).pipe(res);
  });

  server.listen(options.port, fn);
};
