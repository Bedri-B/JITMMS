let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");

let ServiceImage = Models['ServiceImage'];
let ServiceRequest = Models['ServiceRequest'];
let Notification = Models['Notification'];
let Employee = Models['Employee'];
let Manager = Models['Manager'];
let ServiceResponse = Models['ServiceResponse'];

let modelName = "Service Response";

let dictionary = {
    'ServiceRequestId': "Service request ID",
    'item': "Item name",
    'service_requestId': "Service Type Id",
    'user_id': "ServiceRequest ID",
    'fullname': "Full name",
    'phone_number': "Phone number",
    'type': 'ServiceRequest type',
    'id': "ID",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const service_request = await ServiceResponse.findAll({include: [{model: ServiceRequest}, {model: ServiceImage}]});
        res.json({status: 200, data: service_request, message: ""});
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

        const service_response = await ServiceResponse.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_response === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: service_response.toJSON(), message: ""});
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

        const service_responses = await ServiceResponse.findAll({
            where: {
                [Op.or]: [
                    {
                        comment: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                ]
            },
            include: {model: ServiceRequest}
        });

        res.json({status: 200, data: service_responses, message: ""});
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

        const service_response = await ServiceResponse.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_response === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await service_response.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['ServiceRequestId', 'description', 'success'],
            optional: []
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
        // let uniqueData = result['uniqueData'];

        const service_request = await ServiceRequest.findByPk(data['ServiceRequestId']);

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, "Service Request not found!", null, res);
            return;
        }

        if (service_request['EmployeeId'] !== req.user.id) {
            await ErrorHandler.userError(403, "Unauthorized action!", null, res);
            return;
        }

        data['ServiceRequestId'] = service_request.id;
        const service_response = await ServiceResponse.create(data);

        let ImgData = [];
        if (req.files !== undefined) {
            for (let image of req.files) {
                let path = image['path'].replace('public', '');
                ImgData.push({'ServiceResponseId': service_response.id, name: image['originalname'], path: path});
            }
            if (ImgData.length > 0) {
                await ServiceImage.bulkCreate(ImgData);
            }
        }
        service_request['completed'] = true;
        await service_request.save();
        let notificationData = [
            {
                'target': 'Manager',
                'ServiceRequestId': service_request.id,
                'content': 'Response supplied for Service request of Id: ' + service_request.id,
                'ManagerId': service_request['ManagerId']
            },
            {
                'target': 'User',
                'ServiceRequestId': service_request.id,
                'content': 'Response supplied for Service request of Id: ' + service_request.id,
                'UserId': service_request['UserId']
            }
        ];
        await Notification.bulkCreate(notificationData);
        res.json({status: 200, data: service_response, message: modelName + " created successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Approve = async (req, res, next) => {
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

        const service_response = await ServiceResponse.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_response === null) {
            await ErrorHandler.userError(404, modelName + " not found!", null, res);
            return;
        }
        await service_response.update({approved: true});
        let service_request = await ServiceRequest.findByPk(service_response['ServiceRequestId'], {include: {model: Employee}});
        service_request['pending'] = false;
        await service_request.save();
        let notificationData = [
            {
                'target': 'Employee',
                'ServiceRequestId': service_request.id,
                'content': 'Service Request of ID: ' + service_request.id + " Response approved",
                'ManagerId': service_request['EmployeeId']
            },
            {
                'target': 'User',
                'ServiceRequestId': service_request.id,
                'content': 'Service Request of ID: ' + service_request.id + " Response approved",
                'UserId': service_request['UserId']
            }
        ];
        await Notification.bulkCreate(notificationData);
        res.json({status: 200, data: null, message: "Success!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.ChangeStatus = async (req, res, next) => {
    try {
        let entries = {main: ["id", 'value'], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const service_response = await ServiceResponse.findByPk(data['id'], {
            include: {
                model: ServiceRequest,
                include: {model: Manager}
            }
        });

        //return if it doesn't fulfill requirement
        if (service_response === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }
        await service_response.update({success: data['value']});
        let notificationData = [
            {
                'target': 'Manager',
                'ServiceRequestId': service_response['ServiceRequest'].id,
                'content': 'Status Update on Service Request of ID: ' + service_response['ServiceRequest'].id,
                'ManagerId': service_response['ServiceRequest']['ManagerId']
            },
            {
                'target': 'User',
                'ServiceRequestId': service_response['ServiceRequest'].id,
                'content': 'Status Update on Service Request of ID: ' + service_response['ServiceRequest'].id,
                'UserId': service_response['ServiceRequest']['UserId']
            }
        ];
        await Notification.bulkCreate(notificationData);
        res.json({status: 200, data: null, message: "Success!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};
