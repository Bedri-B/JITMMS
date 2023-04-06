<template>
    <main class="w-full flex items-start p-10 max-h-full max-w-full">
        <div class="min-w-fit flex flex-col w-3/4 mr-4">
            <div class="mb-4 flex justify-between items-start">
                <div class="flex items-end">
                    <h1 class="text-2xl leading-none text-black-1 mr-2">Manager</h1>
                    <span class="text-sm leading-none text-block-3">{{ managerList.data.length }} Total</span>

                </div>
                <RouterLink to="/admin/manager/manage">
                    <Button class="w-56 px-4 py-2 ml-10 bg-primary-normal text-white hover:bg-primary-light" rounded>
                        New Manager
                    </Button>
                </RouterLink>
            </div>
            <ManagerTable :actions="managerList.actions"
                           :columns="managerList.columns"
                           :data="filteredList"
                           v-if="!loading">
            </ManagerTable>
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
    import ManagerTable from "../../../components/Admin/Table";
    import Button from "../../../components/Button"
    import axios from 'axios'

    export default {
        name: "Manager",
        components: {
            Card,
            MultipleFilter,
            ManagerTable,
            Button
        },
        created: function () {
            this.loadManagers();
        },
        methods: {
            updateManagerInfo: function (id) {
                this.updateManager('update', id)
            },
            updateManagerPassword: function (id) {
                this.updateManager('password', id)
            },
            updateManager(type, id) {
                let manager = null;
                for (let man of this.managerList['all']) {
                    if (man['id'] === id) {
                        manager = man;
                        break;
                    }
                }
                if (manager === null) return;
                if (type === 'update') {
                    this.$store.commit('setAdminUpdate', {type: 'Manager', val: true, data: manager});
                    this.$router.push('/admin/manager/manage');
                } else if (type === 'password') {
                    this.$store.commit('setAdminUpdate', {type: 'Manager', val: true, data: manager});
                    this.$router.push('/admin/manager/manage/password');
                }
            },

            loadManagers: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/manager/all', {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken
                    }
                }).then((response) => {
                    //console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        for (let manager of res.data) {
                            this.managerList['data'].push({
                                id: manager['id'],
                                fullname: manager['firstName'] + " " + manager['lastName'],
                                username: manager['username'],
                                phone_number: manager['phone_number'],
                                active: manager['active'],
                            });
                        }
                        this.managerList['all'] = res.data;
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
        },
        data() {
            return {
                loading: false,
                managerList: {
                    columns: [
                        {name: 'username', label: 'Username', required: true, sortable: true},
                        {name: 'fullname', label: 'Full Name', required: true, sortable: true},
                        {name: 'phone_number', label: 'Phone Number', required: true, sortable: true},
                        {name: 'active', label: 'Active', required: false, sortable: true},
                        {
                            name: 'actions', label: '',
                            actions: [
                                {
                                    name: 'update',
                                    label: 'bi bi-pencil-square',
                                    tooltip: 'Update Information',
                                    function: this.updateManagerInfo
                                },
                                {
                                    name: 'password',
                                    label: 'bi bi-shield-lock-fill',
                                    tooltip: 'Reset password',
                                    function: this.updateManagerPassword
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
                let list = this.managerList;
                return list.data
                     .filter((row) => {
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