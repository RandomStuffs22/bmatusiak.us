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
        http.app.post('/blog', function(req, res, next) {
            if(req.body.action)
            switch(req.body.action){
                case "new":
                    break;
                case "update":
                    break;
                case "remove":
                    break;
                default:
                    res.redirect("/blog");
                    break;
            }
            else
            res.redirect("/blog");
        });
    });
    
    register(null, {
        "blog": {}
    });

};
