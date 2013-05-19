"use strict";

module.exports = function(options, imports, everyauth) {
    
    var db = imports["db-mongoose"];
    var counter = require("./counter.js")(options, imports);
    var Schema = db.Schema;
    
    //OpenAuth Service Database Model
    var serviceUser = new Schema({
        sid : { type: String, index: true, unique:true },
        uid : {type:Number,default: 1}, // 1 = anonymous user
        meta : String,
        updated: Date
    });
    
    var getAddServiceUser = function(service,sid,meta,callback){
        var users = db.model(service+'_user', serviceUser);
        users.findOne({sid: sid}, function(err,__USER){
            if(!err && !__USER){
                var Users = db.model(service+'_user', serviceUser);
                var new_user = new Users();
                new_user.sid = sid;
                new_user.meta = JSON.stringify(meta);
                new_user.updated = Date.now();
                new_user.uid = 1;
                new_user.save(callback);
            }else if(!err && __USER !== null){
                __USER.updated = Date.now();
                __USER.meta = JSON.stringify(meta);
                __USER.save(callback);
            }
        });
    };
    
    var attachServiceUser = function(service,sid,uid,callback){
        var users = db.model(service+'_user', serviceUser);
        users.findOne({sid: sid}, function(err,__USER){
            if(!err && !__USER){
                callback("ServiceUserNotFound");
            }else if(!err && __USER !== null){
                __USER.uid = uid;
                var meta = JSON.parse(__USER.meta);
                __USER.save(function(xErr){
                    getUser(uid,function(err,_UsEr){
                        _UsEr.email = meta.email;
                        _UsEr.save(function(){
                            callback(null,_UsEr);
                        });
                    });
                });
            }else
                callback(err);
        });
    };
    
    //User Database Model
    var usersCollectionName = "site_user";
    var user = new Schema({
        uid : { type: Number, index: true, unique:true },
        name:String,
        email:String,    
        isAdmin:Boolean
    });
    
    var getUser = function(id,callback){
        var users = db.model(usersCollectionName, user);
        users.findOne({uid: id}, callback);
    };
    
    var newUser = function(serviceName,sid,callback){
        var Users = db.model(usersCollectionName, user);
        counter(function(newID){
            var new_user = new Users();
            new_user.uid = newID;
            new_user.save(function(err,_User){
                if(err) return callback(err);
                attachServiceUser(serviceName,sid,_User.uid,callback);
            });
        });
    };
    
    //User Sessions Functions
    var SessionSchema = imports["db-mongoose-session"].SessionSchema;
    var SessionCollection = imports["db-mongoose-session"].SessionCollection;
    
    var listUserSessions = function(uid,callback){
        var Session = db.model(SessionCollection, SessionSchema);
        Session.find({uid: uid}, function(err,sessions){
            var sessionsS = [];
            for(var i in sessions){
                if(sessions[i].sid)
                    sessionsS.push({
                        id:sessions[i].sid,
                        exp: (new Date(sessions[i].expires)).getTime()
                    });
            }
            callback(null,sessionsS);
        });
    };
    
    var killSession = function(sid,callback){
        imports["db-mongoose-session"].destroy(sid,function(err){
            callback(err);
        });
    };
    
    return {
            getUser:getUser,
            newUser:newUser,
            
            getAddServiceUser:getAddServiceUser,
            attachServiceUser:attachServiceUser,
            
            listUserSessions:listUserSessions,
            killSession:killSession
        };
};

