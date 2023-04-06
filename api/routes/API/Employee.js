let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const bcrypt = require("bcryptjs");
const {Op} = require("sequelize");


let Employee = Models['Employee'];
let ServiceType = Models['ServiceType'];
let Role = Models['Role'];

let modelName = "Employee";

let dictionary = {
    'username': "Username", 'phone_number': "Phone number",
    'firstName': "First name", 'middleName': "Middle name",
    'lastName': "Last name", 'password': "Password",
    'city': "City", 'country': "Country", 'id': "ID",
    'query': "Search query", 'RoleId' : "Role ID"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const employee = await Employee.findAll({include: {model: Role}});
        res.json({status: 200, data: employee, message: ""});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Service = async (req, res, next) => {
    try {

        let entries = {main: ["ServiceTypeId"], optional: [], dictionary};

        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        //check for any error
        if (result["errorCount"] > 0) {
            //send input error response and return
            await ErrorHandler.userError(400, "Input error!", result['error'], res);
            return;
        }
        //input data
        let data = result['data'];
        const service_type = await ServiceType.findByPk(data['ServiceTypeId']);
        if(service_type === null){
            await ErrorHandler.userError(404, "Service Type not found!", {'ServiceTypeId': "Service Type not found!"}, res);
            return;
        }
        const employee = await Employee.findAll({where: {RoleId: service_type['RoleId']}});
        res.json({status: 200, data: employee, message: ""});
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

        const employee = await Employee.findByPk(data['id'], {include: {model: Role}});

        //return if it doesn't fulfill requirement
        if (employee === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: employee.toJSON(), message: ""});
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

        const employees = await Employee.findAll({
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
            },
            include: {model: Role}
        });

        res.json({status: 200, data: employees, message: ""});
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

        const employee = await Employee.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (employee === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await employee.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    try {
        let entries = {
            main: ['username', "password", "firstName", "lastName", 'phone_number', 'RoleId'],
            optional: [],
            unique: ['username', 'phone_number'],
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


        const role = await Role.findByPk(data['RoleId']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, "Role not found!", null, res);
            return;
        }
        //check password validity
        if (data['password'].length < 8) {
            await ErrorHandler.userError(400, "Password must be 8 characters or above!", result['error'], res);
            return;
        }

        data['username'] = data['username'].toString().toLowerCase();

        let employees = await Employee.findAll({
            where: {
                [Op.or]: uniqueData
            }
        });

        if (employees.length > 0) {
            for (let employee of employees) {
                employee = employee.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === employee[entry]) {
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

        const employee = await Employee.create(data);
        res.json({status: 200, data: {id: employee.id}, message: modelName + " registered successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};


//Employee routes
exports.Me = async (req, res, next) => {
    try {
        if(!req.user) {
            await ErrorHandler.userError(401, "", null, res);
            return;
        }
        let currentEmployee = req.user;

        const employee = await Employee.findByPk(currentEmployee['id'], {include: {model: Role}});

        //return if it doesn't fulfill requirement
        if (employee === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: employee.toJSON(), message: ""});
    } catch (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Update = async (req, res, next) => {
    try {
        let entries = {
            main: ['id', "firstName", "lastName", 'phone_number', 'active', 'RoleId'],
            optional: [],
            unique: ['phone_number'],
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

        const role = await Role.findByPk(data['RoleId']);

        //return if it doesn't fulfill requirement
        if (role === null) {
            await ErrorHandler.userError(400, "Role not found!", null, res);
            return;
        }

        const employee = await Employee.findByPk(data['id']);
        if (employee === null) {
            await ErrorHandler.userError(404, "Employee not found!", null, res);
            return;
        }

        let employees = await Employee.findAll({
            where: {
                [Op.and]: [
                    {[Op.or]: uniqueData},
                    {
                        id: {
                            [Op.ne]: employee.id
                        }
                    }
                ]
            }
        });

        if (employees.length > 0) {
            for (let employee of employees) {
                employee = employee.toJSON();
                for (let entry of entries['unique']) {
                    if (uniqueData[entry] === employee[entry]) {
                        let _data = {};
                        _data[entry] = dictionary[entry] + " already registered!";
                        await ErrorHandler.userError(400, dictionary[entry] + " already registered!", _data, res);
                        return;
                    }
                }
            }
        }

        //Update model data
        await employee.update(data);
        res.json({status: 200, data: employee.toJSON(), message: modelName + " updated successfully!"});
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

        const employee = await Employee.findByPk(data['id']);
        if (employee === null) {
            await ErrorHandler.userError(404, "Employee not found!", null, res);
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
        await employee.update(data);
        res.json({status: 200, data: employee.toJSON(), message: modelName + " updated successfully!"});
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

        const employee = await Employee.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (employee === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await employee.update({'active': data['value']});
        let _status = data['value'] ? 'activated' : 'deactivated';
        res.json({status: 200, data: null, message: modelName + " " + _status + " successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};