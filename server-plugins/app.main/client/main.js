define(function(require, exports, module) {
    require("ext/main/jquery");
    var termData = require("text!ext/main/termData.txt").split("\n");
    var currentTermItem = 0;
    
    return function(options, imports, register) {
        register(null,{
            main:{
                init:function(callback){
                    console.log("loaded!");
                    setInterval(function() {
                        while(($("#underLayer")[0].scrollHeight) > $("#underLayer").height()){
                            $($("#underLayer div")[0]).remove();
                        }
                        console.log($("#underLayer").height(),$("#underLayer")[0].scrollHeight);
                        $("#underLayer").append("<div>"+termData[currentTermItem]+"</div>");
                        if(currentTermItem >= termData.length)
                            currentTermItem = 0;
                        else
                            currentTermItem++;
                    }, 450);
                }
            }
        });
    };
});