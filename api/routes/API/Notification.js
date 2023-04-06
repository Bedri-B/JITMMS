let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");


let ServiceRequest = Models['ServiceRequest'];
let ServiceResponse = Models['ServiceResponse'];
let ServiceImage = Models['ServiceImage'];
let Employee = Models['Employee'];
let Comment = Models['Comment'];
let Notification = Models['Notification'];

let modelName = "Notification";

let dictionary = {
    'content': "Comment content", 'ServiceRequestId': "Service request ID", 'id': "ID",
    'query': "Search query", 'type': "Comment type"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const comment = await Comment.findAll({include: [{model: ServiceRequest}, {model: ServiceResponse}]});
        res.json({status: 200, data: comment, message: ""});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.One = async (req, res, next) => {
    try {
        let entries = {main: ["id"], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const comment = await Comment.findByPk(data['id'], {include: [{model: ServiceRequest}, {model: ServiceResponse}]});

        //return if it doesn't fulfill requirement
        if (comment === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: comment.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Search = async (req, res, next) => {
    try {
        let entries = {main: ["query"], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let query = result['data']['query'];

        const comments = await Comment.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        description: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                ]
            }
        });

        res.json({status: 200, data: comments, message: ""});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.FetchMine = async (req, res, next) => {
    try {
        let target = req.user.type;
        let id = req.user.id;
        let data_ = {target: target};
        if (target === 'Manager') {
            data_['ManagerId'] = id;
        } else if (target === 'Employee') {
            data_['EmployeeId'] = id;
        } else {
            data_['UserId'] = id;
        }
        const notification = await Notification.findAll({where: data_, order: [['createdAt', 'DESC']]});

        res.json({status: 200, data: notification, message: ""});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Seen = async (req, res, next) => {
    try {
        let entries = {main: ["id"], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const notification = await Notification.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (notification === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await notification.update({'seen': true});
        res.json({status: 200, data: null, message: "Success!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};







