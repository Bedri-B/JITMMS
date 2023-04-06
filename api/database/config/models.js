const {DataTypes} = require("sequelize");

const sequelize = require("./database");



const UserType = sequelize.define('UserType', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // We need to pass the connection instance
    modelName: 'user_type', // We need to choose the model name
    paranoid: true
});

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    building_no: {
        type: DataTypes.STRING
    },
    room_no:{
        type: DataTypes.STRING
    },
    active:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    defaultScope: {
        attributes: {exclude: ['password']}
    },
    scopes: {
        includePassword: {}
    },
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    paranoid: true
});

const Employee = sequelize.define('Employee', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    defaultScope: {
        attributes: {exclude: ['password']}
    },
    scopes: {
        includePassword: {}
    },
    sequelize, // We need to pass the connection instance
    modelName: 'employee', // We need to choose the model name
    paranoid: true
});

const Manager = sequelize.define('Manager', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    defaultScope: {
        attributes: {exclude: ['password']}
    },
    scopes: {
        includePassword: {}
    },
    sequelize, // We need to pass the connection instance
    modelName: 'Manager', // We need to choose the model name
    paranoid: true
});

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
}, {
    defaultScope: {
        attributes: {exclude: ['password']}
    },
    scopes: {
        includePassword: {}
    },
    sequelize, // We need to pass the connection instance
    modelName: 'admin', // We need to choose the model name
    paranoid: true
});

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // We need to pass the connection instance
    modelName: 'role', // We need to choose the model name
    paranoid: true
});

const ServiceImage = sequelize.define('ServiceImage', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // We need to pass the connection instance
    modelName: 'service_image' // We need to choose the model name
});

const ServiceRequest = sequelize.define('ServiceRequest', {
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    item: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    assigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    assigned_on: {
        type: DataTypes.DATE,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'service_request', // We need to choose the model name
    paranoid: true
});

const ServiceType = sequelize.define('ServiceType', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.TEXT,
        defaultValue: '[]'
    },

}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'service_type', // We need to choose the model name
    paranoid: true
});

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'comment', // We need to choose the model name
    paranoid: true
});

const Notification = sequelize.define('Notification', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    target: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'notification', // We need to choose the model name
    paranoid: true
});

const ServiceResponse = sequelize.define('ServiceResponse', {
    success: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }

}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'service_response', // We need to choose the model name
    paranoid: true
});


//Associations
ServiceRequest.belongsTo(User);
ServiceRequest.belongsTo(Manager);
ServiceRequest.hasMany(ServiceImage);
ServiceRequest.hasMany(Comment);
ServiceRequest.hasMany(Notification);
ServiceRequest.hasOne(ServiceResponse);
ServiceRequest.belongsTo(ServiceType);
ServiceRequest.belongsTo(Employee);

Comment.belongsTo(ServiceResponse);
Comment.belongsTo(ServiceRequest);
Comment.hasOne(ServiceImage);

Manager.hasMany(ServiceRequest);

Notification.belongsTo(Employee);
Notification.belongsTo(Manager);
Notification.belongsTo(User);
Notification.belongsTo(ServiceRequest);

Employee.hasMany(Notification);
Manager.hasMany(Notification);
User.hasMany(Notification);

ServiceResponse.hasMany(ServiceImage);
ServiceResponse.hasMany(Comment);
ServiceResponse.belongsTo(ServiceRequest);

ServiceType.hasMany(ServiceRequest);
ServiceType.belongsTo(Role);

Role.hasMany(ServiceType);
Role.hasMany(Employee);

Employee.hasMany(ServiceRequest);
Employee.belongsTo(Role);

Role.hasMany(Employee);
Role.hasMany(ServiceType);

ServiceImage.belongsTo(ServiceRequest);
ServiceImage.belongsTo(ServiceResponse);
ServiceImage.belongsTo(Comment);


User.hasMany(ServiceRequest);
User.belongsTo(UserType);

UserType.hasMany(User);

module.exports = {
    User: User,
    Role: Role,
    Admin: Admin,
    Comment:Comment,
    Manager: Manager,
    UserType: UserType,
    Employee: Employee,
    ServiceType: ServiceType,
    Notification: Notification,
    ServiceImage: ServiceImage,
    ServiceRequest: ServiceRequest,
    ServiceResponse: ServiceResponse,
};


