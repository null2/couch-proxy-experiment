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

exports.proxy = function(options) {
  options = options || {};

  var couch = request.defaults({ auth: options.auth });

  function proxy(req, res) {
    console.log(req.method, url.resolve(options.url, req.url));
    req.pipe(couch(url.resolve(options.url, req.url), {
      method: req.method,
      headers: {
        'Content-Type': req.header('Content-Type', 'application/json')
      }
    })).pipe(res);
  }

  return proxy;
};

exports.listen = function(options, fn) {
  options = options || {};
  options.port = options.port || 80;
  options.url = options.url || 'http://localhost:5984';
  options.auth = options.auth || {};

  var server = restify.createServer();

  server.use(exports.proxy({
    url: options.url,
    auth: options.auth
  }));

  // hacky hack for the lack of `all`
  ['del', 'get', 'head', 'opts', 'post', 'put', 'patch'].forEach(function(verb) {
    server[verb]('.*', function(req, res) {
      res.send('hello, I am a couch proxy!');
    });
  });

  server.listen(options.port, fn);
};
