define(function(require, exports, module) {
    require("ext/main/jquery");
    require("ext/main/bootstrap");
    
    var termData = require("text!ext/main/termData.txt").split("\n");
    var currentTermItem = 0;
    
    var mainHtml = require("text!ext/main/main.html");
    
    return function(options, imports, register) {
        register(null,{
            main:{
                init:function(callback){
                    console.log("loaded!");
                    $("head").prepend("<link rel='stylesheet' href='/static/bootstrap/themes/cyborg/bootstrap.min.css' type='text/css' media='screen' />");
    
                    $("#mainpage").html(mainHtml);
                    setInterval(function() {
                        while(($("#underLayer")[0].scrollHeight) > $("#underLayer").height()){
                            $($("#underLayer div")[0]).remove();
                        }
                        //console.log($("#underLayer").height(),$("#underLayer")[0].scrollHeight);
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