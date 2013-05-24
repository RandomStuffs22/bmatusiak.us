"use strict";

module.exports = function(options, imports, register) {
    
    var pagesDir = __dirname + "/pages";

    var exports =  {
        welder:imports.welder,
        helpers:imports.helpers,
        counter:imports["db-mongoose-counter"].main,
        ejs:imports.helpers.ejs(__dirname+"/elements"),
        docTYPE:"HTML5",
        renderHTML: function(bodyFile,options,callback){
            var self = this;
            this.ejs.render(bodyFile, options, function(data){
                options.body = function(){
                    return data;
                };
                options.pageTitle = "bmatusiak.us";
                self.ejs._render("<%- "+self.docTYPE+"() %>", options, callback);
            });
        },
        renderSITEMAP: function(options,callback){
            var self = this;
            self.ejs._render("<%- SITEMAP() %>", options, callback);
        },
    };
    
    var marked = require("./static/marked/marked.js");
    var hljs = require("./static/marked/highlight.js");
    
    exports.ejs.staticOption("marked",marked);
    
    marked.setOptions( {
        gfm: true, 
        tables: true, 
        breaks: false, 
        pedantic: false, 
        sanitize: false, 
        smartLists: true, 
        langPrefix:'language-', 
        highlight: function(code, lang) {
            //shortcuts 
            if(lang==='js') lang='javascript';
            
            if(hljs.LANGUAGES[lang]) {
                return hljs.highlight(lang, code).value;
            }
            return code;
        }
    }
    );
    
    imports.welder.addRequestParser(function(http){
        http.app.get('/', function(req, res, next) {
            var renderObject = {
                user: req.user
            };
    
            done();
    
            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                exports.renderHTML(pagesDir + "/body.html",renderObject,function(data){
                    res.end(data);
                });
            }
        });
        http.app.get('/sitemap', function(req, res, next) {
            done();
    
            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/xml'
                });
                exports.renderSITEMAP({},function(data){
                    res.end(data);
                });
            }
        });
        http.app.get('/robots.txt', function(req, res, next) {
            done();
    
            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                exports.ejs._render("<%- ROBOTS() %>", {},function(data){
                    res.end(data);
                });
            }
        });
        
    });
    
    imports.welder.addStatic("/static",__dirname+"/static",true);
    
    register(null, {
        "main": exports
    });

};
