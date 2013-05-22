"use strict";
var fs = require("fs");
var ejs = require("ejs");

module.exports = function(options, imports, register) {
    
    var blogDB = require("./models/blog.js");
    
    imports.main.welder.addRequestParser(function(http) {
        http.app.get('/blog', function(req, res, next) {
            var renderObject = {
                user: req.user
            };

            done();

            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                imports.main.renderHTML(__dirname + "/pages/blog.html",renderObject,function(data){
                    res.end(data);
                });
            }
        });
    });
    
    register(null, {
        "blog": {}
    });

};
