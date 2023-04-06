let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");


let User = Models['User'];
let UserType = Models['UserType'];

let modelName = "User";

let dictionary = {
    'username': "Username", 'phone_number': "Phone number",
    'firstName': "First name", 'middleName': "Middle name",
    'lastName': "Last name", 'password': "Password",
    'city': "City", 'country': "Country", 'id': "ID",
    'query': "Search query", 'UserTypeId': "User Type ID",
    'building_no': 'Building ID', 'room_no': 'Office/Room number',
    'user_id': 'ID'
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const user = await User.findAll({include: {model: UserType}});
        res.json({status: 200, data: user, message: ""});
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

        const user = await User.findByPk(data['id'], {include: {model: UserType}});

        //return if it doesn't fulfill requirement
        if (user === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: user.toJSON(), message: ""});
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

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
                    {
                        user_id: {
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
            },
            include: {model: UserType}
        });

        res.json({status: 200, data: users, message: ""});
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

        const user = await User.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (user === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await user.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['username', "password", "firstName", "lastName", 'phone_number', 'UserTypeId', 'user_id', 'building_no', 'room_no'],
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

        if(!Tools.phone_number_regex(data['phone_number'])){
            await ErrorHandler.userError(400, "Invalid phone number format!", {'phone_number': "Invalid phone number format"}, res);
            return;
        }


        const user_type = await UserType.findByPk(data['UserTypeId']);

        //return if it doesn't fulfill requirement
        if (user_type === null) {
            await ErrorHandler.userError(400, "User Type not found!", null, res);
            return;
        }
        //check password validity
        if (data['password'].length < 8) {
            await ErrorHandler.userError(400, "Password must be 8 characters or above!", result['error'], res);
            return;
        }

        let users = await User.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (users.length > 0) {
            for (let user of users) {
                user = user.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === user[entry]) {
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

        const user = await User.create(data);
        res.json({status: 200, data: {id: user.id}, message: modelName + " registered successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};


//User routes
exports.Me = async (req, res, next) => {
    try {
        if (!req.user) {
            await ErrorHandler.userError(401, "", null, res);
            return;
        }
        let currentUser = req.user;

        const user = await User.findByPk(currentUser['id'], {include: {model: UserType}});

        //return if it doesn't fulfill requirement
        if (user === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: user.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "firstName", "lastName", 'phone_number', 'active', 'UserTypeId', 'user_id', 'building_no', 'room_no'],
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

        const user_type = await UserType.findByPk(data['UserTypeId']);

        //return if it doesn't fulfill requirement
        if (user_type === null) {
            await ErrorHandler.userError(400, "UserType not found!", null, res);
            return;
        }

        const user = await User.findByPk(data['id']);
        if (user === null) {
            await ErrorHandler.userError(404, "User not found!", null, res);
            return;
        }

        let users = await User.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: user.id
                        }
                    }
                ]
            }
        });

        if (users.length > 0) {
            for (let user of users) {
                user = user.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === user[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await user.update(data);
        res.json({status: 200, data: user.toJSON(), message: modelName + " updated successfully!"});
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

        const user = await User.findByPk(data['id']);
        if (user === null) {
            await ErrorHandler.userError(404, "User not found!", null, res);
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
        await user.update(data);
        res.json({status: 200, data: user.toJSON(), message: modelName + " updated successfully!"});
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

        const user = await User.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (user === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await user.update({'active': data['value']});
        let _status = data['value'] ? 'activated' : 'deactivated';
        res.json({status: 200, data: null, message: modelName + " " + _status + " successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};