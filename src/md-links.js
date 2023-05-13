const fs = require('fs')
const path = require('path')

module.exports = function (dir, filterStr, callback) {

    fs.readFile(process.argv[2], function(err, contents) {
        if (err) {
            throw err;
            console.log(err);
        }
    
        console.log(lines);
    })
}