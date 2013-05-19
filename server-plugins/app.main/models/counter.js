"use strict";

module.exports = function(options, imports) {
    return function(callback){
        imports["db-mongoose-counter"]("mainCouter",9874563210,function(Err,counter){
            callback(counter.count);
        });
    };
};

