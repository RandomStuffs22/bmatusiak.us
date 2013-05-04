"use strict";

module.exports = function(options, imports, register) {
    
    imports.welder.addStaticMount("/static",__dirname+"/static");
    
    
    require(__dirname+"/session.js")(options,imports);
    
    var robotsMeta = imports.welder.jquery('<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">');
    imports.welder.jquery(imports.welder.jquery("head")[0]).append(robotsMeta);
    
    register(null, {
        "main": {
            mongoose:imports["db-mongoose"]
        }
    });

};
