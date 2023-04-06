let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");


let Admin = Models['Admin'];

let modelName = "Admin";

let dictionary = {
    'username': "Username", 'phone_number': "Phone number",
    'firstName': "First name", 'middleName': "Middle name",
    'lastName': "Last name", 'password': "Password",
    'city': "City", 'country': "Country", 'id': "ID",
    'query': "Search query", 'RoleId': "Role ID"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const admin = await Admin.findAll();
        res.json({status: 200, data: admin, message: ""});
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

        const admin = await Admin.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (admin === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: admin.toJSON(), message: ""});
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

        const admins = await Admin.findAll({
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

        res.json({status: 200, data: admins, message: ""});
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

        const admin = await Admin.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (admin === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await admin.destroy();
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

        console.log(result);
        let data = result['data'];
        let uniqueData = result['uniqueData'];

        if (data['password'].length < 8) {
            await ErrorHandler.userError(400, "Password must be 8 characters or above!", result['error'], res);
            return;
        }

        let admins = await Admin.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (admins.length > 0) {
            for (let admin of admins) {
                admin = admin.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === admin[entry]) {
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

        const admin = await Admin.create(data);
        res.json({status: 200, data: {id: admin.id}, message: modelName + " registered successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};


//Admin routes
exports.Me = async (req, res, next) => {
    try {
        if (!req.user) {
            await ErrorHandler.userError(401, "", null, res);
            return;
        }
        let currentAdmin = req.user;

        const admin = await Admin.findByPk(currentAdmin['id']);

        //return if it doesn't fulfill requirement
        if (admin === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: admin.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "firstName", "lastName", 'phone_number'],
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

        const admin = await Admin.findByPk(data['id']);
        if (admin === null) {
            await ErrorHandler.userError(404, "Admin not found!", null, res);
            return;
        }

        let admins = await Admin.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: admin.id
                        }
                    }
                ]
            }
        });

        if (admins.length > 0) {
            for (let admin of admins) {
                admin = admin.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === admin[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await admin.update(data);
        res.json({status: 200, data: admin.toJSON(), message: modelName + " updated successfully!"});
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

        const admin = await Admin.findByPk(data['id']);
        if (admin === null) {
            await ErrorHandler.userError(404, "Admin not found!", null, res);
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
        await admin.update(data);
        res.json({status: 200, data: admin.toJSON(), message: modelName + " updated successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};
