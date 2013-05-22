var ejs = require("ejs");
var fs = require("fs");

function EJSfile() {}

EJSfile.prototype.render = function(filename, options, callback) {
    var _self = this;
    fs.readFile(filename, function(err, data) {
        try {
            _self._render(data.toString(), options, callback);
        }
        catch (err) {
            var e = ReferenceError(err.toString().replace("ReferenceError: ejs:", filename + ":"));
            throw e;
        }

    });
};

EJSfile.prototype._render = function(str, options, callback) {
    if (!callback) {
        callback = options;
        options = this.options();
    }
    else {
        this.options(options);
    }

    try {
        callback(ejsRender(str, options));
    }
    catch (err) {
        throw err;
    }

};

EJSfile.prototype.elements = {};

EJSfile.prototype.options = function(options) {
    if (!options) options = {};

    for (var i in this.elements)
    options[i] = this.elements[i];

    return options;
};

EJSfile.prototype.use = function(elementsDir) {

    var theEleFunction = function(str, filename) {
        return function() {
            try {
                return ejsRender(str, this);
            }
            catch (err) {
                var e = ReferenceError(err.toString().replace("ReferenceError: ejs:", filename + ":"));
                throw e;
            }
        };
    };
    var files = fs.readdirSync(elementsDir);

    for (var i in files) {
        this.elements[files[i].replace(".html", "")] = theEleFunction(fs.readFileSync(elementsDir + "/" + files[i]).toString(), elementsDir + "/" + files[i]);
    }
};

function ejsRender() {
    return ejs.render.apply(ejs, arguments);
}

module.exports = function(eleDir) {
    var thisHelper = new EJSfile();
    if (eleDir) thisHelper.use(eleDir);
    return thisHelper;
};