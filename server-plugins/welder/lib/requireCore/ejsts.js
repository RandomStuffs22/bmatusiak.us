define(function(require, exports, module) {
    var ejs = require("ejs");
    return function(ejsName){
    
    EjsTs.prototype = {
        registerd:{},
        render:function(str,obje){//port for migration
            var retval;
            if(typeof str === "object" && this[str[0]]){
                retval = this[str[0]](obje);
            }else{
                retval = this.register("$OTF",str)(obje);
                delete this.registerd.$OTF;
            }
            return retval;
        },
        compile:ejs.compile,//pass for migration
        register:function(name,str){
            var __self = this;
            this.registerd[name]=str;
            __self[name] = function(data){
                var Objests = {};
                Objests.render = __self.render;
                Objests.compile = __self.compile;
                
                var inone = function(Str){
                    return function(_data){
                        if(!_data)_data=data;
                        else
                        for(var i in data){
                            if(!_data[i])
                                _data[i] = data[i];
                        }
                        _data[ejsName] = Objests;
                        return ejs.render(Str,_data);
                    };
                };
                
                if(!data){
                    data = {};
                }
                
                for(var i in __self.registerd){
                    Objests[i] = inone(__self.registerd[i]);
                }
                data[ejsName] = Objests;
                
                return ejs.render(str,data);
            };
            return __self[name];
        }
    };
    
    function EjsTs(){}
    return new EjsTs();
};
});