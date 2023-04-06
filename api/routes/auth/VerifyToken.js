const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const config = process.env;

exports.VT_Admin = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Admin'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_User = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'User'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_Manager = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Manager'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_Employee = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Employee'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};

exports.VT_AU = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'User' && req.user.type !== 'Admin'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_AE = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Employee' && req.user.type !== 'Admin'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_AME = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Employee' && req.user.type !== 'Admin' && req.user.type !== 'Manager'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_AM = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Manager' && req.user.type !== 'Admin'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};


exports.VT_ME = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Manager' && req.user.type !== 'Employee'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_MEU = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'Manager' && req.user.type !== 'Employee' && req.user.type !== 'User'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};
exports.VT_EU = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
        if(req.user.type !== 'User' && req.user.type !== 'Employee'){
            throw jwt.JsonWebTokenError;
        }
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};

exports.VT_All = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.json({status: 403, message: "A token is required for authentication!", data: null});
    }
    try {
        req.user = await promisify(jwt.verify)(token, config.JWT_SECRET);
    } catch (err) {
        console.log(err);
        return res.json({status: 403, message: "Invalid token!", data: null});
    }
    return next();
};