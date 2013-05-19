module.exports = function($options, imports) {
    
    process.env.C9_PID = false;
    
    var domainAPI;
    if(!process.env.C9_PID || process.env.C9_PID == "false"){
        domainAPI = "api.bmatusiak.us";
    }else{
        domainAPI = "project-livec95eb045a2d0.rhcloud.com";
    }

    
    var fs = require("fs");
    var ejs = require("ejs");

    var crypto = require('crypto');
    var md5 = function(test) {
        return crypto.createHash('md5').update(test).digest("hex");
    };

    var pagesDir = __dirname + "/pages";

    var everyauth = require('everyauth');

    var users = require("./models/users.js")($options, imports);
    
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
    .appSecret("sas1sydamobknnd74o6lkzoztj4013xi")
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
    

    return function(http) {
        http.app.use(everyauth.middleware());
        http.app.get('/', function(req, res, next) {
            var renderObject = {
                user: req.user
            };

            done();

            function done() {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                fs.readFile(pagesDir + "/index.html", function(err, data) {
                    try {
                        res.end(
                        ejs.render(
                        data.toString(),
                        renderObject));
                    }
                    catch (e) {
                        res.end(e.toString())
                    }
                });
            }
        });
    };
};