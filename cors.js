const cors = require('cors');

const whitelist = ['http://localhost:3001','http://localhost:3000']

var corsOptions = {
    origin : (origin, cb) => {
        if(whitelist.indexOf(origin)!=-1){
            cb(null,true);
        }
        else{
            cb(null,true);
        }
    }
};

var corsOpts = cors(corsOptions);

exports.corsOpts = corsOpts;