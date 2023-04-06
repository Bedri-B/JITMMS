<template>
    <main class="w-full flex items-start p-10 max-h-full max-w-full">
        <div class="min-w-fit flex flex-col w-3/4 mr-4">
            <div class="mb-4 flex justify-between items-start">
                <div class="flex items-end">
                    <h1 class="text-2xl leading-none text-black-1 mr-2">Employee</h1>
                    <span class="text-sm leading-none text-block-3">{{ employeeList.data.length }} Total</span>

                </div>
                <RouterLink to="/admin/employee/manage">
                    <Button class="w-56 px-4 py-2 ml-10 bg-primary-normal text-white hover:bg-primary-light" rounded>
                        New Employee
                    </Button>
                </RouterLink>
            </div>
            <EmployeeTable :actions="employeeList.actions"
                           :columns="employeeList.columns"
                           :data="filteredList"
                           v-if="!loading">
            </EmployeeTable>
            <div class="w-full mt-10">
                <div class="spinner-border place-content-center animate-spin inline-block w-8 h-8 border-4 rounded-full"
                     role="status"
                     v-if="loading">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
        <Card class="flex min-w-min max-w-max flex-col w-1/4 items-stretch items-start">
            <header class="flex justify-between items-center m-10">
                <h2 class="uppercase text-black-3">Filter</h2>
            </header>
            <section class="mb-10 mx-10">
                <MultipleFilter :data="filter.data" :key="index"
                                :max-value="filter.maxValue"
                                :min-value="filter.minValue"
                                :search="filter.search"
                                :title="filter.title"
                                :type="filter.type"
                                v-for="(filter, index) in filters"
                                v-model="filter.selected">
                </MultipleFilter>
            </section>
        </Card>
    </main>
</template>

<script>
    import Card from "../../../components/Card";
    import MultipleFilter from "../../../components/MultipleFilter";
    import EmployeeTable from "../../../components/Admin/Table";
    import Button from "../../../components/Button"
    import axios from 'axios'

    export default {
        name: "Employee",
        components: {
            Card,
            MultipleFilter,
            EmployeeTable,
            Button
        },
        created: function () {
            this.loadEmployees();
            this.loadRoles();
        },
        methods: {
            updateEmployeeInfo: function (id) {
                this.updateEmployee('update', id)
            },
            updateEmployeePassword: function (id) {
                this.updateEmployee('password', id)
            },
            updateEmployee(type, id) {
                let employee = null;
                for (let emp of this.employeeList['all']) {
                    if (emp['id'] === id) {
                        employee = emp;
                        break;
                    }
                }
                if (employee === null) return;
                if (type === 'update') {
                    this.$store.commit('setAdminUpdate', {type: 'Employee', val: true, data: employee});
                    this.$router.push('/admin/employee/manage');
                } else if (type === 'password') {
                    this.$store.commit('setAdminUpdate', {type: 'Employee', val: true, data: employee});
                    this.$router.push('/admin/employee/manage/password');
                }
            },
            loadEmployees: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/employee/all', {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken
                    }
                }).then((response) => {
                    //console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        for (let employee of res.data) {
                            this.employeeList['data'].push({
                                id: employee['id'],
                                fullname: employee['firstName'] + " " + employee['lastName'],
                                username: employee['username'],
                                phone_number: employee['phone_number'],
                                active: employee['active'],
                                role: employee['Role']['name'],
                            });
                        }
                        this.employeeList['all'] = res.data;
                        this.filters[0]['data'] = res.data;
                    } else {
                        this.$toast.error(res.message);
                    }
                    this.loading = false;
                }).catch((error) => {
                    //console.log(error);
                    this.$toast.error(error.toString());
                    this.loading = false;
                });

            },
            loadRoles: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/role/all', {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken
                    }
                }).then((response) => {
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        for (let role of res.data) {
                            this.filters[1]['data'].push(role['name']);
                        }
                    } else {
                        this.$toast.error(res.message);
                    }
                    this.loading = false;

                }).catch((error) => {
                    // console.log(error);
                    this.$toast.error(error.toString());
                    this.loading = false;
                });

            },
        },
        data() {
            return {
                loading: false,
                employeeList: {
                    columns: [
                        {name: 'username', label: 'Username', required: true, sortable: true},
                        {name: 'fullname', label: 'Full Name', required: true, sortable: true},
                        {name: 'phone_number', label: 'Phone Number', required: true, sortable: true},
                        {name: 'active', label: 'Active', required: false, sortable: true},
                        {name: 'role', label: 'Role', required: false, sortable: true},
                        {
                            name: 'actions', label: '',
                            actions: [
                                {
                                    name: 'update',
                                    label: 'bi bi-pencil-square',
                                    tooltip: 'Update Information',
                                    function: this.updateEmployeeInfo
                                },
                                {
                                    name: 'password',
                                    label: 'bi bi-shield-lock-fill',
                                    tooltip: 'Reset password',
                                    function: this.updateEmployeePassword
                                }
                            ]
                        }
                    ],
                    data: [],
                    all: null,
                },
                filters: [
                    {
                        name: 'search',
                        title: 'Search',
                        data: [],
                        selected: [],
                        search: ['fullname', 'username', 'phone_number'],
                        type: 'search'
                    },
                    {
                        name: 'role',
                        title: 'Role',
                        data: [],
                        selected: [],
                        search: [],
                        type: 'multiple-select'
                    },
                    {
                        name: 'active',
                        title: 'Status',
                        data: ['Active', 'Inactive'],
                        selected: [],
                        search: [],
                        type: 'single-select-boolean'
                    },
                ]
            }
        },
        computed: {
            filteredList() {
                let list = this.employeeList;
                return list.data
                    .filter((row) => {
                        let response = true;
                        this.filters.forEach((filter) => {
                            if (filter.selected && filter.selected.length > 0) {
                                if (filter.name === 'role') {
                                    response = filter.selected.includes(row.role);
                                }
                            }
                        });
                        return response;
                    }) .filter((row) => {
                        let response = true;
                        this.filters.forEach((filter) => {
                            if (filter.selected && filter.selected.length > 0) {
                                if (filter.name === 'active') {
                                    response = filter.selected === 'Active' ? row.active : !row.active;
                                }
                            }
                        });
                        return response;
                    }).filter((row) => {
                        let response = true;
                        this.filters.forEach((filter) => {
                            if (filter.selected && filter.selected.length > 0) {
                                if (filter.name === 'search') {
                                    let not_found = false;
                                    for (let searchParam of filter.search) {
                                       if(row[searchParam].toString().toLowerCase().includes(filter.selected.toString().toLowerCase())){
                                           not_found = true;
                                           break;
                                       }
                                    }
                                    response = not_found;
                                }
                            }
                        });
                        return response;
                    });
            }
        },
    }
</script>