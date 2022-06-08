const fs = require('fs');

class FileHelper {
    static removeFile(fileLocation) {
        if (fileLocation) {
            fs.unlink(fileLocation, (err) => {
                throw Error(err);
            })   
        }
    }
}

module.exports = FileHelper;