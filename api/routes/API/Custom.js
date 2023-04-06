let Models = require("../../database/config/models");
let ErrorHandler = require("../error/ErrorHandler");

let User = Models['User'];
let Employee = Models['Employee'];
let Manager = Models['Manager'];
let UserType = Models['UserType'];
let ServiceType = Models['ServiceType'];
let Role = Models['Role'];


//Admin routes
exports.Count = async (req, res, next) => {
    try {
        let _data = {};
        //User
        const users = await User.findAll();
        _data['user'] = {
                total: users.length,
                active: users.filter(function (user) {
                        return user['active'];
                    }
                ).length,
                inactive: users.filter(function (user) {
                        return !user['active'];
                    }
                ).length,
            };

        //Employee
        const employees = await Employee.findAll();
        _data['employee'] = {
            total: employees.length,
            active: employees.filter(function (employee) {
                    return employee['active'];
                }
            ).length,
            inactive: employees.filter(function (employee) {
                    return !employee['active'];
                }
            ).length,
        };

        //Manager
        const managers = await Manager.findAll();
        _data['manager'] = {
            total: managers.length,
            active: managers.filter(function (manager) {
                    return manager['active'];
                }
            ).length,
            inactive: managers.filter(function (manager) {
                    return !manager['active'];
                }
            ).length,
        };

        //Role
        const roles = await Role.findAll();
        _data['role'] = {total: roles.length};

        //User Type
        const user_types = await UserType.findAll();
        _data['user_type'] = {total: user_types.length};

        //Service Type
        const service_types = await ServiceType.findAll();
        _data['service_type'] = {total: service_types.length};


        res.json({status: 200, data: _data, message: ""});
    } catch (error) {
        await ErrorHandler.serverError(error, res);
    }
};