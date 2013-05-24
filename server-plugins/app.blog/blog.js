"use strict";
var fs = require("fs");
var ejs = require("ejs");

module.exports = function(options, imports, register) {
    
    var blogDB = require("./models/blog.js")(options, imports);
    
    imports.main.welder.addRequestParser(function(http) {
        http.app.get('/blog', function(req, res, next) {
            var renderObject = {
                user: req.user
            };
            
            var page = req.query.page-1 || 0;
            var limit = req.query.limit || 10;
            
            blogDB.blogPage(page,limit,function(err,blogs){
                renderObject.blogItems = blogs.results;
                
                if(blogs.pages >= 1){
                    renderObject.blogPages = blogs.pages;
                    renderObject.nextBlogPage = page+1;
                } else {
                    renderObject.blogPages = 1;
                    renderObject.nextBlogPage = 0;
                }
                
                    
                done();
            });
            
            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                imports.main.renderHTML(__dirname + "/pages/blog.html",renderObject,function(data){
                    res.end(data);
                });
            }
        });
        http.app.get('/blog/:id', function(req, res, next) {
            var renderObject = {
                user: req.user
            };
            
            blogDB.getBlog(req.params.id,function(err,blog){
                renderObject.blogItems = [];
                renderObject.blogItems.push(blog);
                
                renderObject.blogPages = 1;
                renderObject.nextBlogPage = 0;
                done();
            });
            
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
            if(req.body.remove === "true")
                req.body.action = "remove";
                
            if(req.body.action){
                switch(req.body.action){
                    case "new":
                        blogDB.newBlog({
                            body:req.body.body,
                            title:req.body.title,
                            author:req.user.id
                        },function(err,blog){
                            res.redirect("/blog");
                        });
                        break;
                    case "edit":
                        blogDB.updateBlog(req.body.blogid,{
                            body:req.body.body,
                            title:req.body.title,
                            author:req.user.id
                        },function(err,blog){
                            res.redirect("/blog");
                        });
                        break;
                    case "remove":
                        break;
                    default:
                        res.redirect("/blog");
                        break;
                }
            }else{
                res.redirect("/blog");
            }
        });
    });
    
    register(null, {
        "blog": {}
    });

};
