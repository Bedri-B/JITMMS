let Tools = require("../tools/Tools");

exports.serverError = async (error, res) => {
    try{
        console.log(error);
        res.status(500).json({status: 500, data: JSON.stringify(error.stackTrace), message: "Internal Server Error!"});
        logger.error(error);
    }
    catch(_error){
        logger.error(_error);
    }
};


exports.userError = async (status, msg, data, res) => {
    try{
        // res.status(status).json({status: status, data: data, message: msg});
        res.status(200).json({status: status, data: data, message: msg});
    }
    catch(_error){
        logger.verbose(_error);
    }
};



