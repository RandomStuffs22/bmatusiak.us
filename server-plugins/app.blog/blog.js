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
            var limit = req.query.limit || 3;
            
            blogDB.blogPage(page,limit,function(err,blogs){
                renderObject.blogItems = blogs.results;
                
                if(blogs.pages >= parseInt(blogs.pages))
                    blogs.pages = parseInt(blogs.pages)+1;
                else
                    blogs.pages = parseInt(blogs.pages);
                
                if(blogs.pages >= 1 && blogs.pages != page+1){
                    renderObject.blogPages = blogs.pages;
                    renderObject.nextBlogPage = page+2;
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
                if(req.query.raw){
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    if(renderObject.blogItems[0])
                        res.end(renderObject.blogItems[0].body);
                    else{
                        res.end("unknown raw blog page");
                    }
                }else{
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    imports.main.renderHTML(__dirname + "/pages/blog.html",renderObject,function(data){
                        res.end(data);
                    });
                }
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
                            author:req.user.email
                        },function(err,blog){
                            res.redirect("/blog/"+blog._id);
                        });
                        break;
                    case "edit":
                        blogDB.updateBlog(req.body.blogid,{
                            body:req.body.body,
                            title:req.body.title,
                            author:req.user.id
                        },function(err,blog){
                            res.redirect("/blog/"+blog._id);
                        });
                        break;
                    case "remove":
                        blogDB.removeBlog(req.body.blogid,
                        function(err,blog){
                            res.redirect("/blog");
                        });
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
