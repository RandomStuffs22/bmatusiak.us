"use strict";

module.exports = function(options, imports, register) {
    
    //process.env.C9_PID = false;
    
    var domainAPI;
    if(!process.env.C9_PID || process.env.C9_PID == "false"){
        domainAPI = "api.bmatusiak.us";
    }else{
        domainAPI = "project-livec95eb045a2d0.rhcloud.com";
    }

    var crypto = require('crypto');
    var md5 = function(str) {
        return crypto.createHash('md5').update(str).digest("hex");
    };
    var sha256 = function(str) {
        return crypto.createHash('sha256').update(str).digest("hex");
    };
    
    var everyauth = require('everyauth');

    var users = require("./models/users.js")(options, imports);
    
    everyauth.everymodule.handleLogout(function(req, res) {
        req.logout();
        this.redirect(res, "http://"+domainAPI+"/logout?redirect_uri=http://"+req.headers.host+this.logoutRedirectPath());
    });

    everyauth.everymodule.findUserById(function(req, id, callback) {
        users.getUser(id, function(err, user) {
            var User = {};
            if (user) {
                User.id = user.uid;
                User.email = user.email;
                User.email_hash = md5(User.email);
                callback(null, User);
            }
            else callback(null);

        });
    });

    everyauth.everymodule.performRedirect(function(res, location) {
        var session = res.req.session;
        if (location == "/" && session.authNext) {
            location = session.authNext;
            delete session.authNext;
        }
        res.redirect(location, 303);
    });


    function loginService(session, service, service_user_id, sourceMeta, callback) {
        users.getAddServiceUser(service, service_user_id, sourceMeta, function(err, user) {
            if (!err && user && user.uid !== 1) { //not anonymous
                users.getUser(user.uid, function(site_err, site_user) {
                    if (!site_err && site_user) {
                        var _user = {
                            id: user.uid
                        };
                        callback(err, _user);
                    }
                    else if (err) throw new Error(err);
                });
            }
            else if (!err && user) { //anonymous
                users.newUser(service, service_user_id, function(site_err, site_user) {
                    if (!site_err && site_user) {
                        var _user = {
                            id: site_user.uid
                        };
                        callback(err, _user);
                    }
                    else if (site_err) callback(site_err);
                });
            }
            else if (err) return callback(err);
        });
    }
    
    everyauth.bmatusiak
    .appId("9874563211")
    .appSecret(process.env.BMATUSIAK_SECRET || "o0wfflh58bnzqumx0ekxf6fwb30a12vq")
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, authUserMetadata) {
        
        var promise = this.Promise();
        loginService(session, "bmatusiak", authUserMetadata.id, authUserMetadata, function(err, _User) {
            if (err) return promise.fulfill([err]);
            promise.fulfill(_User);
        });
        return promise;
        
      //return usersById[authUserMetadata.id] = authUserMetadata;
    })
    .redirectPath('/');
        
    imports.welder.addRequestParser(function(http) {
        http.app.use(everyauth.middleware());
    });
    
    
    register(null, {
        "auth": {}
    });

};
