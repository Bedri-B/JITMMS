<template>
    <main class="w-full flex items-start p-10 max-h-full max-w-full">
        <div class="min-w-fit flex flex-col w-3/4 mr-4">
            <div class="mb-4 flex justify-between items-start">
                <div class="flex items-end">
                    <h1 class="text-2xl leading-none text-black-1 mr-2">Service Type</h1>
                    <span class="text-sm leading-none text-block-3">{{ service_typeList.data.length }} Total</span>

                </div>
                <RouterLink to="/admin/service_type/manage">
                    <Button class="w-56 px-4 py-2 ml-10 bg-primary-normal text-white hover:bg-primary-light" rounded>
                        New Service Type
                    </Button>
                </RouterLink>
            </div>
            <ServiceTypeTable :actions="service_typeList.actions"
                              :columns="service_typeList.columns"
                              :data="filteredList"
                              v-if="!loading">
            </ServiceTypeTable>
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
    import ServiceTypeTable from "../../../components/Admin/Table";
    import Button from "../../../components/Button"
    import axios from 'axios'

    export default {
        name: "ServiceType",
        components: {
            Card,
            MultipleFilter,
            ServiceTypeTable,
            Button
        },
        created: function () {
            this.loadServiceTypes();
            this.loadRoles();
        },
        methods: {
            updateServiceTypeInfo: function (id) {
                this.updateServiceType('update', id)
            },
            updateServiceType(type, id) {
                let service_type = null;
                for (let man of this.service_typeList['all']) {
                    if (man['id'] === id) {
                        service_type = man;
                        break;
                    }
                }
                if (service_type === null) return;
                if (type === 'update') {
                    this.$store.commit('setAdminUpdate', {type: 'ServiceType', val: true, data: service_type});
                    this.$router.push('/admin/service_type/manage');
                }
            },

            loadServiceTypes: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/service_type/all', {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken
                    }
                }).then((response) => {
                    // eslint-disable-next-line no-console
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        for (let service_type of res.data) {
                            let _data = {
                                id: service_type['id'],
                                name: service_type['name'],
                                description: service_type['description'],
                                role: service_type['Role']['name'],
                                tags: service_type['tags'].length,
                            };
                            this.service_typeList['data'].push(_data);
                        }
                        this.service_typeList['all'] = res.data;
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
                service_typeList: {
                    columns: [
                        {name: 'name', label: 'Name', required: true, sortable: true},
                        {name: 'description', label: 'Description', required: true, sortable: false},
                        {name: 'role', label: 'Role', required: true, sortable: true},
                        {name: 'tags', label: 'Tags', required: true, sortable: false},
                        {
                            name: 'actions', label: '',
                            actions: [
                                {
                                    name: 'update',
                                    label: 'bi bi-pencil-square',
                                    tooltip: 'Update Information',
                                    function: this.updateServiceTypeInfo
                                },
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
                        search: ['name', 'description'],
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
                ]
            }
        },
        computed: {
            filteredList() {
                let list = this.service_typeList;
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
                    }).filter((row) => {
                        let response = true;
                        this.filters.forEach((filter) => {
                            if (filter.selected && filter.selected.length > 0) {
                                if (filter.name === 'search') {
                                    let not_found = false;
                                    for (let searchParam of filter.search) {
                                        if (row[searchParam].toString().toLowerCase().includes(filter.selected.toString().toLowerCase())) {
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