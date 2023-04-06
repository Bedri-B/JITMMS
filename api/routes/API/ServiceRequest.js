let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");


let User = Models['User'];
let Employee = Models['Employee'];
let Role = Models['Role'];
let UserType = Models['UserType'];
let ServiceImage = Models['ServiceImage'];
let ServiceResponse = Models['ServiceResponse'];
let ServiceType = Models['ServiceType'];
let Notification = Models['Notification'];
let ServiceRequest = Models['ServiceRequest'];
let Comment = Models['Comment'];

let modelName = "Service Request";

let dictionary = {
    'EmployeeId': "Employee ID",
    'item': "Item name",
    'ServiceTypeId': "Service Type Id",
    'UserId': "User ID",
    'fullname': "Full name",
    'phone_number': "Phone number",
    'type': 'User type',
    'id': "ID",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const service_request = await ServiceRequest.findAll({
            order: [['createdAt', 'ASC']],
            include: [{model: ServiceImage, order: [['createdAt', 'ASC']]}, {
                model: User,
                include: {model: UserType}
            }, {model: Employee, include: {model: Role}}, {
                model: Comment,
                order: [['createdAt', 'ASC']],
                include: {model: ServiceImage}
            }, {model: ServiceType}, {
                model: ServiceResponse,
                include: [{model: Comment, include: {model: ServiceImage}}, {
                    model: ServiceImage,
                    order: [['createdAt', 'ASC']]
                }]
            }]
        });
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

        const service_request = await ServiceRequest.findByPk(
            data['id'],
            {
                order: [['createdAt', 'ASC']],
                include: [
                    {model: ServiceImage},
                    {model: Comment, order: [['createdAt', 'ASC']], include: {model: ServiceImage}},
                    {model: ServiceType},
                    {
                        model: ServiceResponse,
                        include: [{model: Comment, include: {model: ServiceImage}}, {model: ServiceImage}]
                    },
                    {model: User, include: {model: UserType}},
                    {model: Employee, include: {model: Role}}
                ]
            });

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: service_request.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.New = async (req, res, next) => {
    try {
        const service_request = await ServiceRequest.findAll({
            order: [['createdAt', 'ASC']],
            where: {assigned: false, rejected: false},
            include: [{model: ServiceImage, order: [['createdAt', 'ASC']],}]
        });
        res.json({status: 200, data: service_request.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.NewR = async (req, res, next) => {
    try {
        const service_request = await ServiceRequest.findAll({
            where: {assigned: true, completed: true, pending: true},
            include: [{model: ServiceImage}, {model: ServiceResponse}]
        });
        res.json({status: 200, data: service_request.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.ForMe = async (req, res, next) => {
    try {
        const service_request = await ServiceRequest.findAll({
                where: {
                    assigned: true,
                    EmployeeId: req.user.id,
                    completed: false
                },
                order: [['createdAt', 'ASC']],
                include:
                    [
                        {
                            model: ServiceImage,
                            order: [['createdAt', 'ASC']]
                        },
                        {
                            model: User,
                            include: {
                                model: UserType
                            }
                        },
                        {
                            model: Employee,
                            include: {
                                model: Role
                            }
                        },
                        {
                            model: Comment,
                            order: [['createdAt', 'ASC']],
                            include: {
                                model: ServiceImage
                            }
                        },
                        {
                            model: ServiceType
                        },
                        {
                            model: ServiceResponse,
                            include:
                                [
                                    {
                                        model: Comment,
                                        include: {
                                            model: ServiceImage
                                        }
                                    },
                                    {
                                        model: ServiceImage,
                                        order: [['createdAt', 'ASC']]
                                    }]
                        }]
            }
        );

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: service_request, message: ""});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.MyReq = async (req, res, next) => {
    try {
        const service_request = await ServiceRequest.findAll({
                where: {
                    assigned: true,
                    EmployeeId: req.user.id
                },
                order: [['createdAt', 'ASC']],
                include:
                    [
                        {
                            model: ServiceImage,
                            order: [['createdAt', 'ASC']]
                        },
                        {
                            model: User,
                            include: {
                                model: UserType
                            }
                        },
                        {
                            model: Employee,
                            include: {
                                model: Role
                            }
                        },
                        {
                            model: Comment,
                            order: [['createdAt', 'ASC']],
                            include: {
                                model: ServiceImage
                            }
                        },
                        {
                            model: ServiceType
                        },
                        {
                            model: ServiceResponse,
                            include:
                                [
                                    {
                                        model: Comment,
                                        include: {
                                            model: ServiceImage
                                        }
                                    },
                                    {
                                        model: ServiceImage,
                                        order: [['createdAt', 'ASC']]
                                    }]
                        }]
            }
        );

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: service_request, message: ""});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Mine = async (req, res, next) => {
    try {
        let data = null;
        if (req.user.type === 'User') {
            data = {UserId: req.user.id};
        } else if (req.user.type === 'Employee') {
            data = {assigned: true, EmployeeId: req.user.id}
        }
        const service_request = await ServiceRequest.findAll({
            where: data,
            order: [['createdAt', 'ASC']],
            include: [
                {model: ServiceImage},
                {model: Comment, order: [['createdAt', 'ASC']], include: {model: ServiceImage}},
                {model: ServiceType},
                {
                    model: ServiceResponse,
                    include: [{model: Comment, include: {model: ServiceImage}}, {model: ServiceImage}]
                },
                {model: User, include: {model: UserType}},
                {model: Employee, include: {model: Role}}
            ]
        });

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: service_request, message: ""});
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

        const service_requests = await ServiceRequest.findAll({
            where: {
                [Op.or]: [
                    {
                        code: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        item: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        description: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        comment: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                ]
            },
            include: {model: User},
            order: [['createdAt', 'ASC']],
        });

        res.json({status: 200, data: service_requests, message: ""});
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

        const service_request = await ServiceRequest.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await service_request.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        console.log(req.body);
        let entries = {
            main: ['item', 'description', 'ServiceTypeId'],
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

        const service_type = await ServiceType.findByPk(data['ServiceTypeId']);

        //return if it doesn't fulfill requirement
        if (service_type === null) {
            await ErrorHandler.userError(400, "Service Type not found!", null, res);
            return;
        }

        data['pending'] = true;
        data['accepted'] = false;
        data['rejected'] = false;
        data['assigned'] = false;
        data['completed'] = false;
        data['UserId'] = req.user.id;
        data['ServiceTypeId'] = service_type.id;
        const service_request = await ServiceRequest.create(data);
        service_request['code'] = Tools.Code(service_request.id);
        await service_request.save();
        let ImgData = [];
        if (req.files !== undefined) {
            for (let image of req.files) {
                let path = image['path'].replace('public', '');
                ImgData.push({'ServiceRequestId': service_request.id, name: image['originalname'], path: path});
            }
            if (ImgData.length > 0) {
                await ServiceImage.bulkCreate(ImgData);
            }
        }
        res.json({status: 200, data: service_request, message: modelName + " created successfully!"});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Accept = async (req, res, next) => {
    try {
        let entries = {main: ["id", 'EmployeeId'], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const service_request = await ServiceRequest.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        const employee = await Employee.findByPk(data['EmployeeId']);

        //return if it doesn't fulfill requirement
        if (employee === null) {
            await ErrorHandler.userError(400, "Employee not found!", null, res);
            return;
        }

        let updateData = {
            'accepted': true,
            'ManagerId': req.user.id,
            'assigned': true,
            'assigned_on': new Date(),
            'EmployeeId': employee.id
        };
        await service_request.update(updateData);
        let notificationData = [
            {
                'target': 'Employee',
                'ServiceRequestId': service_request.id,
                'content': 'New Service Request of ID: ' + service_request.id + " is assigned to you",
                'EmployeeId': employee.id
            },
            {
                'target': 'User',
                'ServiceRequestId': service_request.id,
                'content': 'Your Service Request of ID: ' + service_request.id + " have been accepted",
                'UserId': service_request['UserId']
            }
        ];
        await Notification.bulkCreate(notificationData);
        res.json({status: 200, data: null, message: "Success!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Reject = async (req, res, next) => {
    try {
        let entries = {main: ["id", 'comment'], optional: []};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];

        const service_request = await ServiceRequest.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_request === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }
        await service_request.update({pending: false, rejected: true});
        await Comment.create({content: data['comment'], owner: req.user.type, type: 'Request', ServiceRequestId: service_request.id});
        let notificationData = [
            {
                'target': 'User',
                'ServiceRequestId': service_request.id,
                'content': 'Your Service Request of ID: ' + service_request.id + " have been rejected",
                'UserId': service_request['UserId']
            }
        ];
        await Notification.bulkCreate(notificationData);
        res.json({status: 200, data: null, message: "Success!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};



