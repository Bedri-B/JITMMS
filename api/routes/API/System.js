let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");
let Tools = require("../tools/Tools");

const {Op} = require("sequelize");
let sequelize = require("../../database/config/database");


let User = Models['User'];
let System = Models['System'];
let Account = Models['Account'];

let modelName = "System";

let dictionary = {
    'token': "System token", 'name': "System name", 'description': "System description",
    'query': "Search query"
};

//Admin routes
exports.All = async (req, res, next) => {
    try {
        const system = await System.findAll({include: [{model: Account}, {model: User}]});
        res.json({status: 200, data: system, message: ""});
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

        const system = await System.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (system === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        res.json({status: 200, data: system.toJSON(), message: ""});
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

        const systems = await System.findAll({
            where: {
                [Op.or]: [
                    {
                        token: {
                            [Op.like]: '%' + query + '%'
                        }
                    },
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
            },
            include: [{model: Account}, {model: User}]
        });

        res.json({status: 200, data: systems, message: ""});
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

        const system = await System.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (system === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await system.destroy();
        res.json({status: 200, data: null, message: modelName + " deleted successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Create = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        let entries = {
            main: ['UserId'],
            optional: [],
            unique: []
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

        let user = await User.findByPk(data['UserId']);
        if(user === null){
            await ErrorHandler.userError(400,  "User not found!", null, res);
            return;
        }
        
        let systems = await System.findAll({
            where: {
               'UserId': user.id
            }
        });
        if(systems.length > process.MAX_ACCOUNT_PER_USER){
            await ErrorHandler.userError(400, "Max system per user("+ process.MAX_ACCOUNT_PER_USER +") limit reached!", null, res);
            return;
        }
        const system = await System.create(data, {transaction: t});
        let systemData = Tools.System(system.id);
        system['systemNumber'] = systemData['systemNumber'];
        system['shortCode'] = systemData['systemCode'];
        await system.save({transaction: t});
        await t.commit();
        res.json({status: 200, data: system, message: modelName + " created successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
        await t.rollback();
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

        const system = await System.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (system === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await system.update({'active': data['value']});
        let _status = data['value'] ? 'activated' : 'deactivated';
        res.json({status: 200, data: null, message: modelName + " " + _status + " successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};

exports.Suspension = async (req, res, next) => {
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

        const system = await System.findByPk(data['id']);

        //return if it doesn't fulfill requirement
        if (system === null) {
            await ErrorHandler.userError(400, modelName + " not found!", null, res);
            return;
        }

        await system.update({'suspended': data['value']});
        let _status = data['value'] ? 'suspended' : 'unsuspended';
        res.json({status: 200, data: null, message: modelName + " " + _status + " successfully!"});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};



