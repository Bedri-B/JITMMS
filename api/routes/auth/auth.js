const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let Tools = require("../tools/Tools");
let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");

let sequelize = require("../../database/config/database");

let Admin = Models['Admin'];
let Employee = Models['Employee'];
let Role = Models['Role'];
let UserType = Models['UserType'];
let User = Models['User'];
let Manager = Models['Manager'];

let dictionary = {
    'token': "Token", 'username': "Username", 'password': "Password",
    'query': "Search query"
};

exports.Employee_login = async (req, res) => {
    try {
        let entries = {
            main: ["username", "password"],
            optional: []
        };
        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        if (result["errorCount"] > 0) {
            res.json({status: 400, data: result["error"], message: "Error!"});
            return;
        }
        let data = result["data"];
        let employee = await Employee.scope('includePassword').findOne({
            where: {username: data["username"]},
            include: {model: Role}
        });

        if (employee === null || !await bcrypt.compare(data["password"], employee.password)) {
            await ErrorHandler.userError(401, "Invalid Credentials!", null, res);
            return;
        }

        if(!employee.active){
            await ErrorHandler.userError(403, "Account Inactive! Please contact Admin!", null, res);
            return;
        }
        const id = employee.id;
        let type = "Employee";
        const token = jwt.sign(
            {id: id, type: type},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        res.json({status: 200, data: {token: token, type: type, data: employee.toJSON()}, message: "Login Successful!"});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Valid = async (req, res, next) => {
    try {
        if(!req.user) {
            await ErrorHandler.userError(401, "", null, res);
            return;
        }

        if(req.user.type === 'Admin'){
            const admin = await Admin.findByPk(req.user.id, {where: {active: true}});

            //return if it doesn't fulfill requirement
            if (admin === null) {
                res.json({status: 401, data: null, message: ""});
                return;
            }
            res.json({status: 200, data: {type: 'Admin', data: admin.toJSON()}, message: ""});
            return;
        }
        else if(req.user.type === 'Employee'){
            const employee = await Employee.findByPk(req.user.id, {where: {active: true}, include: {model: Role}});

            //return if it doesn't fulfill requirement
            if (employee === null) {
                res.json({status: 401, data: null, message: ""});
                return;
            }
            res.json({status: 200, data: {type: 'Employee', data: employee.toJSON()}, message: ""});
            return;
        }
        else if(req.user.type === 'User'){
            const user = await User.findByPk(req.user.id, {where: {active: true}, include: {model: UserType}});

            //return if it doesn't fulfill requirement
            if (user === null) {
                res.json({status: 401, data: null, message: ""});
                return;
            }
            res.json({status: 200, data: {type: 'User', data: user.toJSON()}, message: ""});
            return;
        }
        else if(req.user.type === 'Manager'){
            const manager = await Manager.findByPk(req.user.id, {where: {active: true}});

            //return if it doesn't fulfill requirement
            if (manager === null) {
                res.json({status: 401, data: null, message: ""});
                return;
            }
            res.json({status: 200, data: {type: 'Manager', data: manager.toJSON()}, message: ""});
            return;
        }

        res.json({status: 401, data: null, message: ""});
    } catch (error) {
        // console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Manager_login = async (req, res) => {
    try {
        let entries = {
            main: ["username", "password"],
            optional: []
        };
        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        if (result["errorCount"] > 0) {
            res.json({status: 400, data: result["error"], message: "Error!"});
            return;
        }
        let data = result["data"];
        let manager = await Manager.scope('includePassword').findOne({
            where: {username: data["username"]},
        });

        if (manager === null || !await bcrypt.compare(data["password"], manager.password)) {
            await ErrorHandler.userError(401, "Invalid Credentials!", null, res);
            return;
        }

        if(!manager.active){
            await ErrorHandler.userError(403, "Account Inactive! Please contact Admin!", null, res);
            return;
        }

        const id = manager.id;
        let type = "Manager";
        const token = jwt.sign(
            {id: id, type: type},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        res.json({status: 200, data: {token: token, type: type, data: manager.toJSON()}, message: "Login Successful!"});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.User_login = async (req, res) => {
    try {
        let entries = {
            main: ["username", "password"],
            optional: []
        };
        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        if (result["errorCount"] > 0) {
            res.json({status: 400, data: result["error"], message: "Error!"});
            return;
        }
        let data = result["data"];
        let user = await User.scope('includePassword').findOne({
            where: {username: data["username"]},
            include: {model: UserType}
        });

        if (user === null || !await bcrypt.compare(data["password"], user.password)) {
            await ErrorHandler.userError(401, "Invalid Credentials!", null, res);
            return;
        }

        if(!user.active){
            await ErrorHandler.userError(403, "Account Inactive! Contact Admin!", null, res);
            return;
        }

        const id = user.id;
        let type = 'User';
        const token = jwt.sign(
            {id: id, type: type, },
            process.env.JWT_SECRET
        );
        res.json({status: 200, data: {token: token, type: type, data: user.toJSON()}, message: "Login Successful!"});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

exports.Admin_login = async (req, res) => {
    try {
        // console.log(req.body);
        let entries = {
            main: ["username", "password"],
            optional: []
        };
        let result = Tools.filter(Object.entries(req.body), entries, dictionary);

        if (result["errorCount"] > 0) {
            res.json({status: 400, data: result["error"], message: "Error!"});
            return;
        }
        let data = result["data"];
        let admin = await Admin.scope('includePassword').findOne({
            where: {username: data["username"]},
        });

        if (admin === null || !await bcrypt.compare(data["password"], admin.password)) {
            await ErrorHandler.userError(401, "Invalid Credentials!", null, res);
            return;
        }

        const id = admin.id;
        let type = 'Admin';
        const token = jwt.sign(
            {id: id, type: type, },
            process.env.JWT_SECRET
        );
        res.json({status: 200, data: {token: token, type: type, data: admin}, message: "Login Successful!"});
    } catch
        (error) {
        console.log(error);
        await ErrorHandler.serverError(error, res);
    }
};

