"use strict";

module.exports = function(options, imports, register) {
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://oniodev:8a9s8d4968ga6sd84@ds047057.mongolab.com:47057/onio_dev');
    
    var MongooseSession = require("./mongooseSession.js")(mongoose,mongoose.Schema)
    var MongoosePlugin = {
        "db-mongoose": mongoose,
        "db-mongoose-session": new MongooseSession({ interval: 120000 }),
        "db-mongoose-counter": require("./indexCounter.js")(mongoose)
    };
    
    register(null, MongoosePlugin);
};