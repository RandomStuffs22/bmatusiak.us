
module.exports = function(options,imports){
    var MongooseSession = imports["db-mongoose-session"];
    
    var cookieDomain;
    if(process.env.MONGOLAB_URI){cookieDomain="opennetwork.io"}else{cookieDomain="shcdn.biz"}
        
    imports.welder.addRequestParser(function(http){
         http.app.use(http.express.session(
            {
                key: 'onio.id',   
                secret: "68a47dsf84as1fasd6as68d16fs1ad", 
                store: MongooseSession,
                cookie: {
                    path: '/',
                    domain: '.'+cookieDomain,
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 //one year(ish)  
                }
            }
        ));
    });
};