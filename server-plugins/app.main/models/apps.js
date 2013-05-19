"use strict";

module.exports = function(options, imports) {
    
    var generateSecret = function(){
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789',
              out = '';
        for(var i=0, clen=chars.length; i<32; i++){
           out += chars.substr(0|Math.random() * clen, 1);
        }
        return out;
    };
    
    var uniqueID = require("./counter.js")(options, imports);
    
    
    var db = imports["db-mongoose"];
    var Schema = db.Schema;
    
    //OpenAuth Service Database Model
    var appService = new Schema({
        id : { type: String, index: true, unique:true },
        secret : String,
        admin:String,
        name:String
    });
    
    var appsCollection = "appService";
    var Apps = db.model(appsCollection, appService);
    
    var getAppService = function(ids,callback){
        if(typeof ids == "object"){
            var ret = {};
            var progged = [];
            for(var id in ids){
                progged.push(getAppService.bind({},ids[id],function(err,app){
                    if(app && app.id)
                        ret[app.id] = app;
                    var nextGet = progged.pop();
                    if(!nextGet)
                        callback(null,ret);
                    else
                        nextGet();
                }));
            }
            var last = progged.pop();
            if(last)
                last(); else callback(null,{});
        }else{
        Apps.findOne({id: ids}, function(err,app){
            if(!err && !app){
                return callback("notfound");
            }else if(!err && app !== null){
                return callback(null,app);
            }
        });
        }
    };
    
    var userApps = function(id,callback){
        Apps.find({admin: id}, function(err,app){
            if(!err && !app){
                return callback("notfound");
            }else if(!err && app !== null){
                return callback(null,app);
            }
        });
    };
    
    var generateAppService = function(name,userId,callback){
        uniqueID(function(newID){
            var app = new Apps();
            app.id = newID;
            app.name = name;
            app.admin = userId;
            app.secret = generateSecret();
            app.save(callback);
        });
    };
    
    var resetAppSecret = function(app_id,callback){
        getAppService(app_id,function(err,app){
            app.secret = generateSecret();
            app.save(callback);
        });
    };
    
    var appServiceGrants = new Schema({
        id : { type: String, index: true, unique:true },//client_id-user_id
        code : String
    });
    var appsGrantsCollection = "appServiceGrants";
    var AppGrants = db.model(appsGrantsCollection, appServiceGrants);
   
    var lookupAppServiceGrant = function(code,callback){
        AppGrants.findOne({code: code}, function(err,grant){
            if(!err && !grant){
                return callback("notfound");
            }else if(!err && grant !== null){
                grant = grant.id.split("-");
                return callback(null,{client_id:grant[0],user_id:grant[1]});
            }
        });
    };
    var getAppServiceGrant = function(client_id,user_id,callback){
        AppGrants.findOne({id: client_id+"-"+user_id}, function(err,grant){
            if(!err && !grant){
                return callback("notfound");
            }else if(!err && grant !== null){
                return callback(null,grant);
            }
        });
    };
    
    var setAppServiceGrant = function(client_id,user_id,code,callback){
        getAppServiceGrant(client_id,user_id,function(err,grant){
            if(!grant){
                grant = new AppGrants();
                grant.id = client_id+"-"+user_id;
                grant.code = code;
                grant.save(callback);
            }else if(!err && grant !== null){
                grant.code = code;
                grant.save(callback);
            }
        });
       
    };
    
    return {            
            getAppService:getAppService,
            generateAppService:generateAppService,
            resetAppSecret:resetAppSecret,
            userApps:userApps,
            setAppServiceGrant:setAppServiceGrant,
            getAppServiceGrant:getAppServiceGrant,
            lookupAppServiceGrant:lookupAppServiceGrant
        };
};

