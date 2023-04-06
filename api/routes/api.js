let express = require('express');
let router = express.Router();

let VT = require("./auth/VerifyToken");
let Auth = require("./auth/auth");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "_" + (new Date()).getTime() + path.extname(file.originalname)
        );
    },
});
const upload = multer({storage: storage});
function multerTester(req, res, next) {
    upload.array('image', 10)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
        } else if (err) {
            console.log(err)
        }

        next();
    });
}

const Custom = require("./API/Custom");
const Employee = require("./API/Employee");
const Admin = require("./API/Admin");
const Manager = require("./API/Manager");
const Comment = require("./API/Comment");
const Notification = require("./API/Notification");
const User = require("./API/User");
const UserType = require("./API/UserType");
const ServiceRequest = require("./API/ServiceRequest");
const ServiceResponse = require("./API/ServiceResponse");
const ServiceType = require("./API/ServiceType");
const Role = require("./API/Role");


/**
 * ================================================================================================
 * Admin Routes
 * ================================================================================================
 */

/** Special */
router.post('/admin/create', upload.none(), Admin.Create);
/** End Special */


/** Custom */
router.get('/admin/count', VT.VT_Admin, Custom.Count);
/** End Custom */

/** Employee */
router.get('/employee/all', VT.VT_Admin, Employee.All);
router.post('/employee/all', upload.none(), VT.VT_Manager, Employee.Service);
router.post('/employee/get', upload.none(), VT.VT_Admin, Employee.One);
router.post('/employee/search', upload.none(), VT.VT_Admin, Employee.Search);
router.post('/employee/delete', upload.none(), VT.VT_Admin, Employee.Delete);
router.post('/employee/create', upload.none(), VT.VT_Admin, Employee.Create);
router.post('/employee/activation', upload.none(), VT.VT_Admin, Employee.Activation);

router.post('/employee/update', upload.none(), VT.VT_AE, Employee.Update);
router.get('/employee/me', VT.VT_Employee, Employee.Me);
router.post('/employee/change_password', upload.none(), VT.VT_AE, Employee.UpdatePassword);
/** End Employee */

/** Manager */
router.get('/manager/all', VT.VT_Admin, Manager.All);
router.post('/manager/get', upload.none(), VT.VT_Admin, Manager.One);
router.post('/manager/search', upload.none(), VT.VT_Admin, Manager.Search);
router.post('/manager/delete', upload.none(), VT.VT_Admin, Manager.Delete);
router.post('/manager/create', upload.none(), VT.VT_Admin, Manager.Create);
router.post('/manager/activation', upload.none(), VT.VT_Admin, Manager.Activation);

router.post('/manager/update', upload.none(), VT.VT_AM, Manager.Update);
router.get('/manager/me', VT.VT_Manager, Manager.Me);
router.post('/manager/change_password', upload.none(), VT.VT_AM, Manager.UpdatePassword);
/** End Manager */

/** User */
router.get('/user/all', VT.VT_Admin, User.All);
router.post('/user/get', upload.none(), VT.VT_Admin, User.One);
router.post('/user/search', upload.none(), VT.VT_Admin, User.Search);
router.post('/user/delete', upload.none(), VT.VT_Admin, User.Delete);
router.post('/user/create', upload.none(), VT.VT_Admin, User.Create);
router.post('/user/activation', upload.none(), VT.VT_Admin, User.Activation);

router.post('/user/update', upload.none(), VT.VT_AU, User.Update);
router.get('/user/me', VT.VT_User, User.Me);
router.post('/user/change_password', upload.none(), VT.VT_AU, User.UpdatePassword);
/** End User */

/** Role */
router.get('/role/all', VT.VT_Admin, Role.All);
router.post('/role/get', upload.none(), VT.VT_Admin, Role.One);
router.post('/role/search', upload.none(), VT.VT_Admin, Role.Search);
router.post('/role/delete', upload.none(), VT.VT_Admin, Role.Delete);
router.post('/role/create', upload.none(), VT.VT_Admin, Role.Create);
router.post('/role/update', upload.none(), VT.VT_Admin, Role.Update);
/** End Role */

/** UserType */
router.get('/user_type/all', VT.VT_Admin, UserType.All);
router.post('/user_type/get', upload.none(), VT.VT_Admin, UserType.One);
router.post('/user_type/search', upload.none(), VT.VT_Admin, UserType.Search);
router.post('/user_type/delete', upload.none(), VT.VT_Admin, UserType.Delete);
router.post('/user_type/create', upload.none(), VT.VT_Admin, UserType.Create);
router.post('/user_type/update', upload.none(), VT.VT_Admin, UserType.Update);
/** End UserType */

/** ServiceType */
router.get('/service_type/all', VT.VT_All, ServiceType.All);
router.post('/service_type/get', upload.none(), VT.VT_AME, ServiceType.One);
router.post('/service_type/search', upload.none(), VT.VT_Admin, ServiceType.Search);
router.post('/service_type/delete', upload.none(), VT.VT_Admin, ServiceType.Delete);
router.post('/service_type/create', upload.none(), VT.VT_Admin, ServiceType.Create);
router.post('/service_type/update', upload.none(), VT.VT_Admin, ServiceType.Update);
/** End ServiceType */

/** ServiceResponse */
router.get('/service_response/all', VT.VT_Admin, ServiceResponse.All);
router.post('/service_response/get', upload.none(), VT.VT_AME, ServiceResponse.One);
router.post('/service_response/search', upload.none(), VT.VT_Admin, ServiceResponse.Search);
router.post('/service_response/delete', upload.none(), VT.VT_Admin, ServiceResponse.Delete);
router.post('/service_response/create', upload.any('image'), VT.VT_Employee, ServiceResponse.Create);
router.post('/service_response/approve', upload.none(), VT.VT_Manager, ServiceResponse.Approve);
router.post('/service_response/status', upload.none(), VT.VT_ME, ServiceResponse.ChangeStatus);

/** End ServiceResponse */

/** Comment */
router.get('/comment/all', VT.VT_Admin, Comment.All);
router.post('/comment/get', upload.none(), VT.VT_AME, Comment.One);
router.post('/comment/search', upload.none(), VT.VT_Admin, Comment.Search);
router.post('/comment/delete', upload.none(), VT.VT_Admin, Comment.Delete);
router.post('/comment/create', upload.single('image'), VT.VT_ME, Comment.Create);
/** End Comment */

/** Notification */
router.get('/notification/all', VT.VT_Admin, Notification.All);
router.post('/notification/get', upload.none(), VT.VT_ME, Notification.One);
router.get('/notification/mine', VT.VT_MEU, Notification.FetchMine);
router.post('/notification/seen', upload.none(), VT.VT_MEU, Notification.Seen);
/** End Notification */

/** ServiceRequest */
router.get('/service_request/all', VT.VT_Manager, ServiceRequest.All);
router.post('/service_request/get', upload.none(), VT.VT_All, ServiceRequest.One);
router.get('/service_request/for_me', VT.VT_Employee, ServiceRequest.ForMe);
router.get('/service_request/mine', VT.VT_EU, ServiceRequest.Mine);
router.get('/service_request/new', VT.VT_Manager, ServiceRequest.New);
router.post('/service_request/search', upload.none(), VT.VT_Admin, ServiceRequest.Search);
router.post('/service_request/delete', upload.none(), VT.VT_Admin, ServiceRequest.Delete);
router.post('/service_request/create', upload.any('image'), VT.VT_User, ServiceRequest.Create);
router.post('/service_request/accept', upload.none(), VT.VT_Manager, ServiceRequest.Accept);
router.post('/service_request/reject', upload.none(), VT.VT_Manager, ServiceRequest.Reject);
/** End ServiceRequest */

/**
 * ================================================================================================
 * Admin Routes End
 * ================================================================================================
 */

/**
 * ================================================================================================
 * Public Routes
 * ================================================================================================
 */

router.post('/auth/valid', VT.VT_All, Auth.Valid);


/** Employee */
router.post('/employee/login', upload.none(), Auth.Employee_login);
/** End Employee */

/** Manager */
router.post('/manager/login', upload.none(), Auth.Manager_login);
/** Manager User */

/** Admin */
router.post('/admin/login', upload.none(), Auth.Admin_login);
/** Admin User */

/** User */
router.post('/user/login', upload.none(), Auth.User_login);
/** User User */

/**
 * ================================================================================================
 * Public Routes End
 * ================================================================================================
 */

module.exports = router;
