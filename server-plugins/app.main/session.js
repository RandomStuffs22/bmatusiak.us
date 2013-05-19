
module.exports = function(options,imports){
    var MongooseSession = imports["db-mongoose-session"];
    
    return function(http){
         http.app.use(http.express.session(
            {
                key: 'onio.id',   
                secret: "68a47dsf84as1fasd6as68d16fs1ad", 
                store: MongooseSession,
                cookie: {
                    path: '/',
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 //one year(ish)  
                }
            }
        ));
    };
};