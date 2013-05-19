"use strict";

module.exports = function(options, imports, register) {
    
    imports.welder.addRequestParser(require(__dirname+"/session.js")(options,imports));
    
    imports.welder.addRequestParser(require(__dirname+"/auth.js")(options,imports));
    
    imports.welder.addStatic("/static",__dirname+"/static",true);
    
    register(null, {
        "main": {}
    });

};
