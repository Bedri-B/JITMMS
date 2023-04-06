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

let modelName = "Comment";

let dictionary = {
    'content': "Comment content", 'ServiceRequestId': "Service request ID", 'id': "ID",
    'query': "Search query", 'type': "Comment type"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const comment = await Comment.findAll();
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

        const comment = await Comment.findByPk(data['id']);

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

exports.Delete = async (req, res, next) => {
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

        const comment = await Comment.findByPk(data['id'], {include: {model: ServiceRequest}});

        //return if it doesn't fulfill requirement
        if (comment === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        if (comment['service_requests'].length > 0) {
            await ErrorHandler.userError(406, "Unable to delete " + modelName, null, res);
            return;
        }

        await comment.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['content', 'type', 'ServiceRequestId'],
            optional: [],
            unique: []
        };

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const service_request = await ServiceRequest.findByPk(data['ServiceRequestId'], {include: [{model: ServiceResponse}, {model: Employee}]});
        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, "Service Request not found!", {'RoleId': "Service Request not found!"}, res);
            return;
        }


        if (data['type'] === 'Response') {
            data['ServiceResponseId'] = service_request['ServiceResponse']['id'];
            delete data['ServiceRequestId'];
        } else if (data['type'] === 'Request') {
            data['ServiceRequestId'] = service_request['id'];
        } else if (data['type'] !== 'Request') {
            await ErrorHandler.userError(400, "Input error!", [{'type': "Invalid comment type"}], res);
            return;
        }

        data['owner'] = req.user.type;
        const comment = await Comment.create(data);
        if (req.file !== undefined) {
            let path = req.file['path'].replace('public', '');
            await ServiceImage.create({name: req.file['originalname'], path: path, CommentId: comment.id})
        }
        let notificationData = null;
        if (service_request['assigned']) {
            if (req.user.type === 'Employee') {
                notificationData = [
                    {
                        'target': 'Manager',
                        'ServiceRequestId': service_request.id,
                        'content': 'Update on Service Request of ID: ' + service_request.id,
                        'ManagerId': service_request['ManagerId']
                    },
                    {
                        'target': 'User',
                        'ServiceRequestId': service_request.id,
                        'content': 'Update on Service Request of ID: ' + service_request.id,
                        'UserId': service_request['UserId']
                    }
                ];
            } else {
                notificationData = [
                    {
                        'target': 'Employee',
                        'ServiceRequestId': service_request.id,
                        'content': 'Update on Service Request of ID: ' + service_request.id,
                        'EmployeeId': service_request['Employee']['id']
                    },
                    {
                        'target': 'User',
                        'ServiceRequestId': service_request.id,
                        'content': 'Update on Service Request of ID: ' + service_request.id,
                        'UserId': service_request['UserId']
                    }
                ];
            }
            await Notification.bulkCreate(notificationData);
        }
        res.json({status: 200, data: comment, message: modelName + " created successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};




