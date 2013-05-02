"use strict";
var isNodeWebkit = (typeof process == "object") && process.versions && process.versions['node-webkit'];
//var path = require("path");
var jsdom = require("jsdom");

var pathFinder = require("./pathFinder.js");

module.exports = function(options, imports,welder,setup) {
    var setStartFile = __dirname + '/startpage/index.html';
    var setStartBodyFile = __dirname + '/startpage/body.html';
    
    var setStartFileContent = require("fs").readFileSync(setStartFile,"utf8");
    var setStartBodyFileContent = require("fs").readFileSync(setStartBodyFile,"utf8");
    
    
    jsdom.env("<html><head></head><body></body></html>",[__dirname + '/jquery/jquery.js'], function (err, window) {
        var $ = window.$;
        
        function Router(){}
        
        Router.jquery = $;
        
        var _Routes = {};
        Router.addRoute = function(routeName,RouteFn){
            if(typeof routeName == "function"){
                pathFinder.addPath(routeName);
            }else{
                _Routes[routeName] = RouteFn || routeName;
            }
        };
        /*
        var _RouteChecks = [];
        Router.routeCheck = function(fn){
            if(fn && typeof fn == "function"){
                _RouteChecks.push(fn);
            }
        };*/
            
        Router.listen = function(getPaths,architectClientPlugins,callback){
            var ejs = imports.ejs;
            var http = imports.http;
            var appConfig = {};
            
            var compiledStartFile = ejs.compile(setStartFileContent,{filename:setStartFile});
            
            function renderIndex(req, res){
                var params;
                if(req.params && req.params[0]){
                    params = req.params[0].split("/");
                    for(var i in params){
                        if(params[i] === ""){
                            params.splice(1,i);
                        }
                    }
                }
                var headHtml = $("head").html();
                res.end(compiledStartFile({
                    appConfig:appConfig,
                    isBuild:options.isBuild,
                    body: setStartBodyFileContent,
                    head: headHtml,
                    pageCode:res.statusCode
                }));
            }
            
            
            var name;
            if (!isNodeWebkit)
            {
                appConfig.baseUrl = "/static/core";
                appConfig.paths= {};
                appConfig.paths.static = "/static";
                for (name in welder.clientExtensions) {
                    appConfig.paths[name] = "/static/"+name;
                } 
            }else{
                appConfig.baseUrl = __dirname+"/requireCore";
                appConfig.paths= {};
                for (name in welder.clientExtensions) {
                    appConfig.paths[name] = welder.clientExtensions[name];
                } 
            }
            
            appConfig.config = {
                welder : {
                    architectPlugins : architectClientPlugins
                }
            };
            
            //detect node-webkit
            if (isNodeWebkit)
            {
                window.appConfig = appConfig;
            }
            
            http.app.get('/favicon.ico',function(req,res){
                res.redirect('/static/images/favicon.ico');
            });
            
            http.app.get('/',renderIndex);//initial route
            
            /*if(_Routes)
            for(var i in _Routes){
               http.app.get(i,renderIndex);
            }*/
            
            for(var j in _Routes){
               pathFinder.addPath(j);//http.app.get(i,renderIndex);
            }
            
            http.app.use(function(req,res){
                pathFinder.checkPath(req.url,function(matched,params){
                    if(!matched)
                    res.statusCode = 404;
                    
                    renderIndex(req,res);
                });
            });
            
            
            callback();
        };
    
    
        setup(Router);
        //window.close();
    });
};

