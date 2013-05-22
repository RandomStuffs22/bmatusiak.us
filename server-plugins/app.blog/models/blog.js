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
                $blog.remove();
                return callback(null);
            }
        });
    };
    
    var newBlog = function(obj){
        
    };
    
    var removeBlog = function(id,callback){
        getBlog(id, function(err,$blog){
            if(!err && !$blog){
                return callback("notfound");
            }else if(!err && $blog !== null){
                $blog.remove();
                return callback(null);
            }
        });
        
    };
    
    var blogPage = function(page,length,callback){
        
        blog.paginate({}, page,length, callback);
    };
    
    return {};
};

