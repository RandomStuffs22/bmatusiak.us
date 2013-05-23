"use strict";

module.exports = function(options, imports) {
    
    var paginate = require('mongoose-paginate');

    var db = imports["db-mongoose"];
    
    var Schema = db.Schema;
    
    var blogSchema = new Schema({
        title: String,
        author: String,
        body: String,
        comments: [{
            body: String,
            date: Date
        }],
        date: {
            type: Date,
            default: Date.now
        },
        hidden: Boolean,
        meta: {
            votes: Number,
            favs: Number
        }
    });
    
    var blogCollection = "appService";
    
    var blog = db.model(blogCollection, blogSchema);
    
    var getBlog = function(id,callback){
        blog.findOne({_id: id}, function(err,$blog){
            if(!err && !$blog){
                return callback("notfound");
            }else if(!err && $blog !== null){
                return callback(null,$blog);
            }
        });

    };
    
    var updateBlog = function(id,obj,callback){
        getBlog(id, function(err,$blog){
            if(!err && !$blog){
                return callback("notfound");
            }else if(!err && $blog !== null){
                for(var i in obj){
                    $blog[i] = obj[i];
                }
                $blog.save(callback);
            }
        });
    };
    
    var newBlog = function(obj,callback){
        var $blog = new blog();
        for(var i in obj){
            $blog[i] = obj[i];
        }
        $blog.save(callback);
    };
    
    var removeBlog = function(id,callback){
        getBlog(id, function(err,$blog){
            if(!err && !$blog){
                return callback("notfound");
            }else if(!err && $blog !== null){
                $blog.remove();
                $blog.save(callback);
            }
        });
        
    };
    
    var blogPage = function(page,length,callback){
        blog.paginate({}, page,length, callback);
    };
    
    return {};
};

