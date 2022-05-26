const multer = require('multer');

const storageConfig = multer.diskStorage({
    destination: (request, file, callBack) => {
        callBack(null, process.env.FILE_UPLOAD_DIR);
    },
    filename: (request, file, callBack) => {
        callBack(null, `${Date.now()}-${file.originalname}`);
    }
});

module.exports = multer({storage: storageConfig});