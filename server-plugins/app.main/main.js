"use strict";

module.exports = function(options, imports, register) {
    
    imports.welder.addStaticMount("/static",__dirname+"/static");
    
    
    require(__dirname+"/session.js")(options,imports);
    
    register(null, {
        "main": {
            mongoose:imports["db-mongoose"]
        }
    });

};
