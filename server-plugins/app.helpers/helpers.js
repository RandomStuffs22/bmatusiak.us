"use strict";
var fs = require("fs");
var ejs = require("ejs");

module.exports = function(options, imports, register) {
    var helpers = {};
    
    var helpersDir = __dirname+"/helpers";
    
    var files = fs.readdirSync(helpersDir);
        
    for(var i in files){
        
        helpers[files[i]] = require(helpersDir+"/"+files[i]);
        
    }
    
    register(null, {
        "helpers": helpers
    });

};
