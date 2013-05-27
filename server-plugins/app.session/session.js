module.exports = function(options,imports,register){
    var MongooseSession = imports["db-mongoose-session"];
    
    imports.welder.addRequestParser(function(http){
         http.app.use(http.express.session(
            {
                key: 'bm.us.id',   
                secret: process.env.SESSION_SECRET, 
                store: MongooseSession,
                cookie: {
                    path: '/',
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 //one year(ish)  
                }
            }
        ));
    });
    
     register(null, {
        "session": {}
    });
};