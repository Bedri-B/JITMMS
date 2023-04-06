let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");


let ServiceRequest = Models['ServiceRequest'];
let ServiceType = Models['ServiceType'];
let Role = Models['Role'];

let modelName = "Service Type";

let dictionary = {
    'name': "Service type name", 'description': "Service type description", 'id': "ID",
    'query': "Search query", 'RoleId': "Role ID"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const service_type = await ServiceType.findAll({include: {model: Role}});
        service_type.forEach(function (val) {
            try {
                if (val['tags'] === null) {
                    val['tags'] = []
                } else {
                    val['tags'] = JSON.parse(val['tags']);
                }
            } catch (e) {
                val['tags'] = []
            }
        });
        res.json({status: 200, data: service_type, message: ""});
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

        const service_type = await ServiceType.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_type === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }
        let service_type_ = service_type.toJSON();
        try {
            if (service_type_['tags'] === null) {
                service_type_['tags'] = []
            } else {
                service_type_['tags'] = JSON.parse(service_type_['tags']);
            }
        } catch (e) {
            service_type_['tags'] = []
        }
        res.json({status: 200, data: service_type_, message: ""});
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

        const service_types = await ServiceType.findAll({
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

        res.json({status: 200, data: service_types, message: ""});
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

        const service_type = await ServiceType.findByPk(data['id'], {include: {model: ServiceRequest}});

        //return if it doesn't fulfill requirement
        if (service_type === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        if (service_type['service_requests'].length > 0) {
            await ErrorHandler.userError(406, "Unable to delete " + modelName, null, res);
            return;
        }

        await service_type.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['name', 'description', 'RoleId', 'tags'],
            optional: [],
            unique: ['name']
        };

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        console.log(req.body);
        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];
        let uniqueData = result['uniqueData'];

        const role = await Role.findByPk(data['RoleId']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, "Role not found!", null, res);
            return;
        }

        let service_types = await ServiceType.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (service_types.length > 0) {
            for (let service_type of service_types) {
                service_type = service_type.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === service_type[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }
        const service_type = await ServiceType.create(data);
        res.json({status: 200, data: service_type, message: modelName + " created successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "name", "description", 'RoleId', 'tags'],
            optional: [],
            unique: ['name'],
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
        let uniqueData = result['uniqueData'];

        const role = await Role.findByPk(data['RoleId']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, "Role not found!", null, res);
            return;
        }

        const service_type = await ServiceType.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (service_type === null) {
            await ErrorHandler.userError(400, "User Type not found!", null, res);
            return;
        }

        let service_types = await ServiceType.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: service_type.id
                        }
                    }
                ]
            }
        });

        if (service_types.length > 0) {
            for (let service_type of service_types) {
                service_type = service_type.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === service_type[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await service_type.update(data);
        res.json({status: 200, data: service_type.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};





