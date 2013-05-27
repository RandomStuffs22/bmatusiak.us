module.exports = function(passConfig){
    require("./herokuc9-env.js")(function(){
        passConfig([
            "./app.main",
            "./app.auth",
            "./app.blog",
            "./app.helpers",
            "./db.mongoose",
            "./app.session",
            "./welder"
        ]);
    });
};

