import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

/* eslint-disable no-param-reassign */
export default new Vuex.Store({
    state: {
        nextId: 1,
        menuListItems: {
            'Admin': [
                {
                    id: 0,
                    icon: "bi bi-columns-gap",
                    title: "Summery",
                    url: "/admin/home"
                },
                {
                    id: 1,
                    icon: "bi bi-person-workspace",
                    title: "Manager",
                    url: "/admin/manager"
                },
                {
                    id: 2,
                    icon: "bi bi-person-badge",
                    title: "Employee",
                    url: "/admin/employee"
                },
                {
                    id: 3,
                    icon: "bi bi-people-fill",
                    title: "User",
                    url: "/admin/user"
                },
                {
                    id: 4,
                    icon: "bi bi-person-lines-fill",
                    title: "Role",
                    url: "/admin/role"
                },
                {
                    id: 5,
                    icon: "bi bi-people",
                    title: "User Type",
                    url: "/admin/user_type"
                },
                {
                    id: 6,
                    icon: "bi bi-gear-wide-connected",
                    title: "Service Type",
                    url: "/admin/service_type"
                },
            ],
            'User': [
                {
                    id: 0,
                    icon: "bi bi-clipboard2-plus",
                    title: "New Form",
                    url: "/user/home"
                },
                {
                    id: 1,
                    icon: "bi bi-clipboard2-check",
                    title: "My Forms",
                    url: "/user/forms"
                },
            ],
            'Employee': [
                {
                    id: 0,
                    icon: "bi bi-ui-checks",
                    title: "New Request",
                    url: "/employee/home"
                },
                {
                    id: 1,
                    icon: "bi bi-hourglass-split",
                    title: "Pending Request",
                    url: "/employee/requests/pending"
                },
                {
                    id: 2,
                    icon: "bi bi-archive",
                    title: "Request Archive",
                    url: "/employee/archive"
                },
            ],
            'Manager': [
                {
                    id: 0,
                    icon: "bi bi-columns-gap",
                    title: "Summery",
                    url: "/manager/home"
                },
                {
                    id: 1,
                    icon: "bi bi-ui-checks-grid",
                    title: "New Request",
                    url: "/manager/requests/new"
                },
                {
                    id: 2,
                    icon: "bi bi-ui-checks",
                    title: "Assigned Request",
                    url: "/manager/requests/assigned"
                },
                {
                    id: 3,
                    icon: "bi bi-archive",
                    title: "Request Archive",
                    url: "/manager/archive"
                },
            ],
        },
        user: {
            firstName: "",
            lastName: "",
            role: "",
            data: null
        },

        //Backend
        backend: 'http://localhost:2349',
        backend2: 'http://localhost:2349',

        //Auth
        logged_in: false,
        user_type: "",
        token: "",

        //Admin =======
        // Employee
        admin_employee_update: false,
        admin_employee_data: null,
        // Manager
        admin_manager_update: false,
        admin_manager_data: null,
        // User
        admin_user_update: false,
        admin_user_data: null,
        // Role
        admin_role_update: false,
        admin_role_data: null,
        // User Type
        admin_user_type_update: false,
        admin_user_type_data: null,
        // Service Type
        admin_service_type_update: false,
        admin_service_type_data: null,
        //End Admin =========

        notifications: [],
        notificationService: null,


        //User
        user_page: {
            forms: {
                active: false,
                data: null,
            },
            item: {
                active: false,
                data: null,
            }
        },

        //Manager
        manager_page: {
            forms: {
                active: false,
                data: null,
            },
            item: {
                active: false,
                data: null,
            }
        },

        //Manager
        employee_page: {
            forms: {
                active: false,
                data: null,
            },
            item: {
                active: false,
                data: null,
            }
        },
        sidebar_fun: null

    },
    mutations: {
        Logout(state) {
            state.logged_in = false;
            state.user_type = '';
            state.token = '';
            state.notifications = [];
            state.user = {
                firstName: "",
                lastName: "",
                role: "",
                data: null
            };
            localStorage.clear();
        },

        NotificationService(state, fun) {
            state.notificationService = fun;
        },

        SidebarFun(state, fun) {
            state.sidebar_fun = fun;
        },

        Notification(state, data) {
            state.notifications = data;
        },

        clearNotifications(state) {
            state.notifications = [];
        },

        setAuthStatus(state, auth) {
            state.logged_in = auth;
        },

        setAuthToken(state, token) {
            state.token = token;
        },

        setAuthType(state, type) {
            state.user_type = type;
        },

        setAuthUser(state, data) {
            state.user.firstName = data['data']['firstName'];
            state.user.lastName = data['data']['lastName'];
            let role = '';
            if (data['type'] === 'Admin') {
                role = 'System Administrator';
            } else if (data['type'] === 'Employee') {
                role = data['data']['Role']['name'];
            } else if (data['type'] === 'User') {
                role = data['data']['UserType']['name'];
            } else if (data['type'] === 'Manager') {
                role = 'Manager'
            }
            state.user.role = role;
        },

        setAdminUpdate(state, arg) {
            let type = arg['type'];
            let val = arg['val'];
            let data = arg['data'];
            switch (type) {
                case 'Employee': {
                    state.admin_employee_update = val;
                    state.admin_employee_data = data;
                    break;
                }
                case 'Manager': {
                    state.admin_manager_update = val;
                    state.admin_manager_data = data;
                    break;
                }
                case 'User': {
                    state.admin_user_update = val;
                    state.admin_user_data = data;
                    break;
                }
                case 'Role': {
                    state.admin_role_update = val;
                    state.admin_role_data = data;
                    break;
                }
                case 'UserType': {
                    state.admin_user_type_update = val;
                    state.admin_user_type_data = data;
                    break;
                }
                case 'ServiceType': {
                    state.admin_service_type_update = val;
                    state.admin_service_type_data = data;
                    break;
                }
            }
        },

        setUserUpdate(state, arg) {
            let type = arg['type'];
            let val = arg['val'];
            let data = arg['data'];
            switch (type) {
                case 'Item': {
                    state.user_page['item']['active'] = val;
                    state.user_page['item']['data'] = data;
                    break;
                }
                case 'Forms': {
                    state.user_page['forms']['active'] = val;
                    state.user_page['forms']['data'] = data;
                    break;
                }
            }

        },

        setManagerUpdate(state, arg) {
            let type = arg['type'];
            let val = arg['val'];
            let data = arg['data'];
            switch (type) {
                case 'Item': {
                    state.manager_page['item']['active'] = val;
                    state.manager_page['item']['data'] = data;
                    break;
                }
                case 'Forms': {
                    state.manager_page['forms']['active'] = val;
                    state.manager_page['forms']['data'] = data;
                    break;
                }
            }

        },

        setEmployeeUpdate(state, arg) {
            let type = arg['type'];
            let val = arg['val'];
            let data = arg['data'];
            switch (type) {
                case 'Item': {
                    state.employee_page['item']['active'] = val;
                    state.employee_page['item']['data'] = data;
                    break;
                }
                case 'Forms': {
                    state.employee_page['forms']['active'] = val;
                    state.employee_page['forms']['data'] = data;
                    break;
                }
            }

        },

        async setNotificationSeen(state, pair) {
            let type = pair['type'] === "sidebar" ? 'id' : 'ServiceRequestId';
            let id = pair['id'];
            let data = state.notifications;
            state.notifications = [];
            for (let nt of data) {
                if (nt['seen']) {
                    state.notifications.push(nt);
                    continue;
                }
                if (nt[type] === id) {
                    let formData = new FormData();
                    formData.append('id', nt['id']);
                    if (!state.logged_in) return;
                    await axios(state.backend + '/api/notification/seen',
                        {
                            headers: {
                                "x-access-token": state.token
                            },
                            method: "post",
                            data: formData
                        }).then((response) => {
                        // eslint-disable-next-line no-console
                        //console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            nt['seen'] = true;
                        }
                    }).catch((error) => {
                        this.error_pit = error
                    });
                }
                state.notifications.push(nt);
            }
        },

    },
    getters: {

        SideBarFun(state) {
            return state.sidebar_fun;
        },
        /**
         * @return {string}
         */
        AuthToken(state) {
            return state.token;
        },
        /**
         * @return {string}
         */
        AuthType(state) {
            return state.user_type;
        },

        AuthStatus(state) {
            return state.logged_in;
        },

        getMenuListItem(state) {
            return state.menuListItems[state.user_type];
        },

        getUser(state) {
            return state.user;
        },

        Notifications(state) {
            return state.notifications;
        },

        /**
         * @return {number}
         */
        NewNotificationCount(state) {
            let count = 0;
            for (let nt of state.notifications) {
                if (!nt['seen']) count++;
            }
            return count;
        },

        NotificationService(state) {
            return state.notificationService;
        },

        /**
         * @return {string}
         */
        API(state) {
            return state.backend;
        },


        //Admin
        /**
         * @return {boolean}
         */
        AMU(state) {
            return state.admin_manager_update;
        },
        AMD(state) {
            return state.admin_manager_data;
        },

        /**
         * @return {boolean}
         */
        AEU(state) {
            return state.admin_employee_update;
        },
        AED(state) {
            return state.admin_employee_data;
        },

        /**
         * @return {boolean}
         */
        AUU(state) {
            return state.admin_user_update;
        },
        AUD(state) {
            return state.admin_user_data;
        },

        /**
         * @return {boolean}
         */
        ARU(state) {
            return state.admin_role_update;
        },
        ARD(state) {
            return state.admin_role_data;
        },

        /**
         * @return {boolean}
         */
        AUTU(state) {
            return state.admin_user_type_update;
        },
        AUTD(state) {
            return state.admin_user_type_data;
        },

        /**
         * @return {boolean}
         */
        ASTU(state) {
            return state.admin_service_type_update;
        },
        ASTD(state) {
            return state.admin_service_type_data;
        },

        //User
        UDF(state) {
            return state.user_page['item'];
        },

        UDFS(state) {
            return state.user_page['forms']['data'];
        },

        //Manager
        MDF(state) {
            return state.manager_page['item'];
        },

        MDFS(state) {
            return state.manager_page['forms']['data'];
        },

        //Manager
        EDF(state) {
            return state.employee_page['item'];
        },

        EDFS(state) {
            return state.employee_page['forms']['data'];
        },


    }
});