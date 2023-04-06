import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'is-active',
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            name: 'main_page',
            component: () => import('./pages/MainPage.vue'),
        },

        {
            path: '/admin/login',
            name: 'admin_login',
            component: () => import('./pages/Admin/Login.vue'),
            meta: {Login: true}
        },
        {
            path: '/login',
            name: 'user_login',
            component: () => import('./pages/User/Login.vue'),
            meta: {Login: true}
        },
        {
            path: '/manager/login',
            name: 'manager_login',
            component: () => import('./pages/Manager/Login.vue'),
            meta: {Login: true}
        },
        {
            path: '/employee/login',
            name: 'employee_login',
            component: () => import('./pages/Employee/Login.vue'),
            meta: {Login: true}
        },

        //Admin Routes
        {
            path: '/admin/home',
            name: 'admin_home',
            component: () => import('./pages/Admin/Summery.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/manager',
            name: 'admin_manager',
            component: () => import('./pages/Admin/Manager/Manager.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/manager/manage',
            name: 'admin_manager_manage',
            component: () => import('./pages/Admin/Manager/ManagerManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/manager/manage/password',
            name: 'admin_manager_manage_password',
            component: () => import('./pages/Admin/Manager/ManagerPassword.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/employee',
            name: 'admin_employee',
            component: () => import('./pages/Admin/Employee/Employee.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/employee/manage',
            name: 'admin_employee_manage',
            component: () => import('./pages/Admin/Employee/EmployeeManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/employee/manage/password',
            name: 'admin_employee_manage_password',
            component: () => import('./pages/Admin/Employee/EmployeePassword.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/user',
            name: 'admin_user',
            component: () => import('./pages/Admin/User/User.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/user/manage',
            name: 'admin_user_manage',
            component: () => import('./pages/Admin/User/UserManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/user/manage/password',
            name: 'admin_user_manage_password',
            component: () => import('./pages/Admin/User/UserPassword.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/role',
            name: 'admin_role',
            component: () => import('./pages/Admin/Role/Role.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/role/manage',
            name: 'admin_role_manage',
            component: () => import('./pages/Admin/Role/RoleManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/user_type',
            name: 'admin_user_type',
            component: () => import('./pages/Admin/UserType/UserType.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/user_type/manage',
            name: 'admin_user_type_manage',
            component: () => import('./pages/Admin/UserType/UserTypeManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        {
            path: '/admin/service_type',
            name: 'admin_service_type',
            component: () => import('./pages/Admin/ServiceType/ServiceType.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },
        {
            path: '/admin/service_type/manage',
            name: 'admin_service_type_manage',
            component: () => import('./pages/Admin/ServiceType/ServiceTypeManage.vue'),
            meta: {requiresAuth: true, Type: 'Admin'}
        },

        //User Routes
        {
            path: '/user/home',
            name: 'user_home',
            component: () => import('./pages/User/Home.vue'),
            meta: {requiresAuth: true, Type: 'User'}
        },

        {
            path: '/user/forms',
            name: 'user_forms',
            component: () => import('./pages/User/MyForms.vue'),
            meta: {requiresAuth: true, Type: 'User'}
        },
        {
            path: '/user/forms/detail',
            name: 'user_form_detail',
            component: () => import('./pages/User/FormDetail.vue'),
            meta: {requiresAuth: true, Type: 'User'}
        },

        //Manager Routes
        {
            path: '/manager/home',
            name: 'manager_home',
            component: () => import('./pages/Manager/Home.vue'),
            meta: {requiresAuth: true, Type: 'Manager'}
        },
        {
            path: '/manager/requests/new',
            name: 'manager_request_new',
            component: () => import('./pages/Manager/NewRequests.vue'),
            meta: {requiresAuth: true, Type: 'Manager'}
        },
        {
            path: '/manager/requests/assigned',
            name: 'manager_request_assigned',
            component: () => import('./pages/Manager/AssignedRequests.vue'),
            meta: {requiresAuth: true, Type: 'Manager'}
        },
        {
            path: '/manager/requests/detail',
            name: 'manager_request_detail',
            component: () => import('./pages/Manager/FormDetail.vue'),
            meta: {requiresAuth: true, Type: 'Manager'}
        },
        {
            path: '/manager/archive',
            name: 'manager_archive',
            component: () => import('./pages/Manager/RequestArchive.vue'),
            meta: {requiresAuth: true, Type: 'Manager'}
        },

        //Employee Routes
        {
            path: '/employee/home',
            name: 'employee_home',
            component: () => import('./pages/Employee/NewRequests.vue'),
            meta: {requiresAuth: true, Type: 'Employee'}
        },
        {
            path: '/employee/requests/pending',
            name: 'employee_requests_pending',
            component: () => import('./pages/Employee/PendingRequests.vue'),
            meta: {requiresAuth: true, Type: 'Employee'}
        },
        {
            path: '/employee/archive',
            name: 'employee_archive',
            component: () => import('./pages/Employee/RequestArchive.vue'),
            meta: {requiresAuth: true, Type: 'Employee'}
        },
        {
            path: '/employee/requests/detail',
            name: 'employee_request_detail',
            component: () => import('./pages/Employee/FormDetail.vue'),
            meta: {requiresAuth: true, Type: 'Employee'}
        },

        {
            path: '/*',
            name: '404',
            component: () =>import('./pages/Error404.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters.AuthStatus) {
            if (to.matched.some((record) => record.meta.Type === store.getters.AuthType)) {
                next()
            } else {
                next('/' + store.getters.AuthType.toString().toLowerCase())
            }
        } else {
            next('/')
        }
    }
    else {
        if (store.getters.AuthStatus) {
            next('/' + store.getters.AuthType.toString().toLowerCase() + "/home");
            return;
        }
        if (to.matched.some((record) => record.meta.Login)) {
            next();
            return;
        }
        next()
    }
});


export default router;

/**

 {
            path: '/analytics',
            name: 'analytics',
            component: () => import('./pages/Summery.vue'),
        },
 {
            path: '/vehicles',
            name: 'vehicles',
            component: () => import('./pages/Employee.vue'),
        },
 {
            path: '/service-reminders',
            name: 'serviceReminders',
            component: () => import('./pages/ServiceReminders.vue'),
        }
 **/