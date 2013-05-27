module.exports = function($done){
    var doneCalled = false;
    function done(){
        if(!doneCalled){
            doneCalled = true;
            $done();
        }
    }
    if(!process.env.C9_PROJECT){
        return done();
    }
    
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
      done();
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
                if(herokuCONFIG["DEV_"+j])
                    process.env[j] = herokuCONFIG["DEV_"+j];
                else
                    process.env[j] = herokuCONFIG[j];
            }
        }
        
        done();
    });
};

