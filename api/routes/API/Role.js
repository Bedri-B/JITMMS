let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");


let ServiceType = Models['ServiceType'];
let Employee = Models['Employee'];
let Role = Models['Role'];

let modelName = "Role";

let dictionary = {
    'name': "Role name", 'description': "Role description", 'id': "ID",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const role = await Role.findAll();
        res.json({status: 200, data: role, message: "Olla"});
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

        const role = await Role.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: role.toJSON(), message: ""});
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

        const roles = await Role.findAll({
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

        res.json({status: 200, data: roles, message: ""});
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

        const role = await Role.findByPk(data['id'], {include: [{model: ServiceType}, {model: Employee}]});

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        if (role['service_types'].length > 0 || role['employees'].length > 0) {
            await ErrorHandler.userError(406, "Unable to delete " + modelName, null, res);
            return;
        }

        await role.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['name', 'description'],
            optional: [],
            unique: ['name']
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

        let roles = await Role.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (roles.length > 0) {
            for (let role of roles) {
                role = role.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === role[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        const role = await Role.create(data);
        res.json({status: 200, data: role, message: modelName + " created successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "name", "description"],
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

        const role = await Role.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, "Role not found!", null, res);
            return;
        }

        let roles = await Role.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: role.id
                        }
                    }
                ]
            }
        });

        if (roles.length > 0) {
            for (let role of roles) {
                role = role.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === role[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await role.update(data);
        res.json({status: 200, data: role.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};



