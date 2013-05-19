"use strict";

module.exports = function(options, imports, register) {
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOLAB_URI);
    
    var MongooseSession = require("./mongooseSession.js")(mongoose,mongoose.Schema)
    var MongoosePlugin = {
        "db-mongoose": mongoose,
        "db-mongoose-session": new MongooseSession({ interval: 120000 }),
        "db-mongoose-counter": require("./indexCounter.js")(mongoose)
    };
    
    register(null, MongoosePlugin);
};