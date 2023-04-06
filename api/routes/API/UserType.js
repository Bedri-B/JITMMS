let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");

let User = Models['User'];
let UserType = Models['UserType'];

let modelName = "User Type";

let dictionary = {
    'name': "User Type name", 'description': "User Type description", 'id': "ID",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const user_type = await UserType.findAll();
        res.json({status: 200, data: user_type, message: ""});
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

        const user_type = await UserType.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (user_type === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: user_type.toJSON(), message: ""});
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

        const user_types = await UserType.findAll({
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

        res.json({status: 200, data: user_types, message: ""});
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

        const user_type = await UserType.findByPk(data['id'], {include: {model: User}});

        //return if it doesn't fulfill requirement
        if (user_type === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        if (user_type['service_types'].length > 0 || user_type['employees'].length > 0){
            await ErrorHandler.userError(406, "Unable to delete " + modelName, null, res);
            return;
        }

        await user_type.destroy();
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

        let user_types = await UserType.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (user_types.length > 0) {
            for (let user_type of user_types) {
                user_type = user_type.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === user_type[entry]) {
                         let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        const user_type = await UserType.create(data);
        res.json({status: 200, data: user_type, message: modelName + " created successfully!"});
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

        const user_type = await UserType.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (user_type === null) {
            await ErrorHandler.userError(400, "User Type not found!", null, res);
            return;
        }

        let user_types = await UserType.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: user_type.id
                        }
                    }
                ]
            }
        });

        if (user_types.length > 0) {
            for (let user_type of user_types) {
                user_type = user_type.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === user_type[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await user_type.update(data);
        res.json({status: 200, data: user_type.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};



