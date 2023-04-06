let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");


let Manager = Models['Manager'];

let modelName = "Manager";

let dictionary = {
    'username': "Username", 'phone_number': "Phone number",
    'firstName': "First name", 'middleName': "Middle name",
    'lastName': "Last name", 'password': "Password",
    'city': "City", 'country': "Country", 'id': "ID",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const manager = await Manager.findAll();
        res.json({status: 200, data: manager, message: ""});
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

        const manager = await Manager.findByPk(data['id'], {include: {model: Role}});

        //return if it doesn't fulfill requirement
        if (manager === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: manager.toJSON(), message: ""});
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

        const managers = await Manager.findAll({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        firstName: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        phone_number: {
                            [Op.like]: '%' + query + '%'
                        }
                    }
                ]
            }
        });

        res.json({status: 200, data: managers, message: ""});
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

        const manager = await Manager.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (manager === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await manager.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['username', "password", "firstName", "lastName", 'phone_number'],
            optional: [],
            unique: ['username', 'phone_number']
        };

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data

        // console.log(result);
        let data = result['data'];
        let uniqueData = result['uniqueData'];

        if(!Tools.phone_number_regex(data['phone_number'])){
            await ErrorHandler.userError(400, "Invalid phone number format!", {'phone_number': "Invalid phone number format"}, res);
            return;
        }

        //check password validity
        if (data['password'].length < 8) {
            await ErrorHandler.userError(400, "Password must be 8 characters or above!", result['error'], res);
            return;
        }

        let managers = await Manager.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (managers.length > 0) {
            for (let manager of managers) {
                manager = manager.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === manager[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        let password = data['password'];
        data['password'] = await bcrypt.hash(password, 10);
        data['active'] = true;

        const manager = await Manager.create(data);
        res.json({status: 200, data: {id: manager.id}, message: modelName + " registered successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};


//Manager routes
exports.Me = async (req, res, next) => {
    try {
        if (!req.user) {
            await ErrorHandler.userError(401, "", null, res);
            return;
        }
        let currentManager = req.user;

        const manager = await Manager.findByPk(currentManager['id']);

        //return if it doesn't fulfill requirement
        if (manager === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: manager.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "firstName", "lastName", 'phone_number', 'active'],
            optional: [],
            unique: ['phone_number']
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

        if(!Tools.phone_number_regex(data['phone_number'])){
            await ErrorHandler.userError(400, "Invalid phone number format!", {'phone_number': "Invalid phone number format"}, res);
            return;
        }

        const manager = await Manager.findByPk(data['id']);
        if (manager === null) {
            await ErrorHandler.userError(404, "Manager not found!", null, res);
            return;
        }

        let managers = await Manager.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: manager.id
                        }
                    }
                ]
            }
        });

        if (managers.length > 0) {
            for (let manager of managers) {
                manager = manager.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === manager[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await manager.update(data);
        res.json({status: 200, data: manager.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.UpdatePassword = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "password"],
            optional: [],
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

        const manager = await Manager.findByPk(data['id']);
        if (manager === null) {
            await ErrorHandler.userError(404, "Manager not found!", null, res);
            return;
        }
        //check password validity
        if (data['password'].length < 8) {
            await ErrorHandler.userError(400, "Password must be 8 characters or above!", result['error'], res);
            return;
        }

        let password = data['password'];
        data['password'] = await bcrypt.hash(password, 10);

        //Update model data
        await manager.update(data);
        res.json({status: 200, data: manager.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Activation = async (req, res, next) => {
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

        const manager = await Manager.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (manager === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await manager.update({'active': data['value']});
        let _status = data['value'] ? 'activated' : 'deactivated';
        res.json({status: 200, data: null, message: modelName + " " + _status + " successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};