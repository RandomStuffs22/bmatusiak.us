module.exports = function(done){
    if(!process.env.C9_PROJECT){
        return done();
    }
    
    //put stuff here to set up env
    process.env.MONGOLAB_URI = 
        process.env.MONGOLAB_URI ||
        "mongodb://heroku_app11001646:i1h37es0jri2havsjll1qtlbe1@ds047447.mongolab.com:47447/heroku_app11001646";
    
    var spawn = require('child_process').spawn,
    heroku = spawn(
        'heroku', 
        ['config'],
        {   
            cwd : __dirname
        }
    );
    
    var herokuOutput = "";
    heroku.stdout.on('data', function (data) {
      herokuOutput += data.toString();
    });
    
    heroku.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    
    var herokuCONFIG = {};
    heroku.on('close', function (code) {
        herokuOutput = herokuOutput.split("\n");
        for(var i in herokuOutput){
            if(herokuOutput !== ""){
                var clean = herokuOutput[i].replace(":","<[$%$]>");
                clean = clean.split("<[$%$]>");
                
                if(clean[1]){
                    clean[0] = clean[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    clean[1] = clean[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    herokuCONFIG[clean[0]] = clean[1];
                }
            }
        }
        
        for(var j in herokuCONFIG){
            if(j !== "PATH"){
                process.env[j] = herokuCONFIG[j];
            }
        }
        
        console.log(herokuCONFIG);
        done();
    });
};

