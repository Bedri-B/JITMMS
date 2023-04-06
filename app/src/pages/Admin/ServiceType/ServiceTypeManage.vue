<template>
    <main class="flex flex-col w-full p-10 max-h-full">
        <!-- Jumbotron -->
        <div class="mx-auto p-6 shadow-lg rounded-lg bg-primary-light text-gray-900">
            <h2 class="font-semibold text-3xl mb-5">{{ title }}</h2>

            <hr class="my-6 border-blue-600"/>


            <div class="flex flex-col">
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <select
                            @click="resetError"
                            aria-label="Role"
                            class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            v-model="RoleId"
                    >
                        <option :value="-1" disabled>Role</option>
                        <option
                                :value="role.id"
                                v-bind:key="role.id"
                                v-for="role in roles"
                        >
                            {{ role.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="_name_input"
                            placeholder="Name"
                            type="text"
                            v-model="name"
                    />
                    <label class="text-gray-700" for="_name_input"
                    >Name</label
                    >
                    <div class="text-sm mt-1 text-red-600" v-if="error['name']">
                        {{ error["name"] }}
                    </div>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="mx-5 form-floating mb-3 xl:w-96">
                        <textarea
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_description_input"
                                placeholder="Description"
                                v-model="description"></textarea>
                    <label class="text-gray-700" for="_description_input"
                    >Description</label
                    >
                    <div class="text-sm mt-1 text-red-600" v-if="error['description']">
                        {{ error["description"] }}
                    </div>
                </div>
            </div>

            <div class="flex flex-col max-w-40">
                <div @click="addTagInput" class="flex flex-row place-items-center gap-2 cursor-pointer p-2 bg-blue-600 hover:bg-blue-500 text-white rounded mx-5 place-self-start form-floating mb-3">
                    <p>Add tag</p> <i class="bi bi-plus" style="font-size: 20px;"> </i>
                </div>
            </div>

            <div class="flex flex-col" v-if="tags.length > 0">
                <div class="flex flex-col md:flex-row mx-5 gap-2 place-items-center border-t border-gray-500 p-2" :key="index" v-for="(tag, index) in tags">
                    <div class="md:w-6/12 w-full form-floating mb-3 xl:w-40"
                    >
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                :id="'__tag__input__' + index"
                                placeholder="Tag"
                                type="text"
                                v-model="tag.name"
                        />
                        <label class="text-gray-700" :for="'__tag__input__' + index"
                        >Tag</label
                        >
                    </div>
                    <div class="md:w-6/12 w-full flex flex-row">
                        <div class="md:w-3/4 w-full flex flex-row form-check form-switch xl:w-40 gap-2 p-2 items-center justify-items-start">
                            <label
                                    class="form-check-label inline-block text-gray-800"
                                    for="flexSwitchCheckDefault"
                            >Optional</label
                            >
                            <input
                                    class="form-check-input appearance-none w-9 rounded-full  h-5 align-top bg-grey-700 bg-no-repeat bg-contain bg-gray-700 focus:outline-none cursor-pointer shadow-sm"
                                    id="flexSwitchCheckDefault"
                                    role="switch"
                                    type="checkbox"
                                    v-model="tag.optional"
                            />
                        </div>
                        <div @click="removeTagInput(index)" class="md:w-1/4 bg-rose-700 rounded px-1 mx-2 my-2 text-white justify-center">
                            <i class="bi bi-x" style="font-size: 20px"></i>
                        </div>
                    </div>
                </div>
            </div>


            <hr class="my-6 border-blue-600"/>
            <button
                    @click="Create"
                    class="inline-block px-6 py-2.5 mt-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    type="button_"
                    v-if="!loading"
            >
                {{ action }}
            </button>
            <div
                    class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                    role="status"
                    v-if="loading"
            >
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <!-- Jumbotron -->

    </main>
</template>

<script>
    import axios from "axios";

    export default {
        name: "ManageServiceType",
        components: {},
        created: function () {
            this.loadRoles();
            if (this.$store.getters.ASTU) {
                this.title = "Update Service Type";
                this.action = "Update";
                this.update = true;
                let data = this.$store.getters.ASTD;
                this.id = data["id"];
                this.name = data["name"];
                this.description = data["description"];
                this.RoleId = data["RoleId"];
                this.tags = data['tags'];

                this.$store.commit('setAdminUpdate', {type: 'ServiceType', val: false, data: null});
            }
        },
        methods: {
            addTagInput: function(){
                let data = {name: "", optional: true, value: ""};
                this.tags.push(data);
            },
            removeTagInput: function(index){
                let temp = [];
                this.tags.forEach(function (val, i) {
                    if(index !== i) {
                        temp.push(val);
                    }
                });
                this.tags = temp;
            },
            checkTagInput: function(){
                let temp = [];
                let d_tag = false;
                let that = this;
                this.tags.forEach(function (val) {
                    if(temp.indexOf(val['name'].toString().toLowerCase().trim()) === -1) {
                        temp.push(val['name'].toString().toLowerCase().trim());
                    }else{
                      that.$toast.error("Duplicate tag: " + val['name']);
                      d_tag = true;
                    }
                });
                return d_tag;
            },
            reset: function () {
                this.id = "";
                this.name = "";
                this.description = "";
                this.RoleId = -1;
            },
            resetError: function () {
                this.error = {
                    name: "",
                    description: "",
                    RoleId: -1,
                };
            },
            Create: async function () {
                if(this.checkTagInput()) return;
                this.loading = true;
                if (this.update) {
                    let data = {
                        id: this.id,
                        name: this.name,
                        description: this.description,
                        RoleId: this.RoleId,
                        tags: JSON.stringify(this.tags)
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/service_type/update", {
                        method: "post",
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "x-access-token": this.$store.getters.AuthToken,
                        },
                        data: formData,
                    })
                        .then((response) => {
                            // eslint-disable-next-line no-console
                            //console.log(response);
                            let res = response.data;
                            if (res.status === 200) {
                                this.$toast.success("Service Type information updated successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "ServiceType",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.$router.push("/admin/service_type/");
                            } else if (res.status === 400) {
                                if (res.data === null) {
                                    this.$toast.error(res.message);
                                } else {
                                    let errors = res.data;
                                    for (let index in errors) {
                                        this.error[index] = errors[index];
                                    }
                                }
                            } else {
                                this.error_msg = res.message;
                                this.$toast.error(this.error_msg);
                            }
                            this.loading = false;
                        })
                        .catch((error) => {
                            // eslint-disable-next-line no-console
                            // console.log(error);
                            if (error.response) {
                                this.error_pit = error;
                                this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                                this.$toast.error(this.error_msg);
                            } else {
                                this.$toast.error("Network Error!");
                            }
                            this.loading = false;
                        });
                }
                else {
                    let data = {
                        name: this.name,
                        description: this.description,
                        RoleId: this.RoleId,
                        tags: JSON.stringify(this.tags),
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/service_type/create", {
                        method: "post",
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "x-access-token": this.$store.getters.AuthToken,
                        },
                        data: formData,
                    })
                        .then((response) => {
                            // eslint-disable-next-line no-console
                            //console.log(response);
                            let res = response.data;
                            if (res.status === 200) {
                                this.$toast.success("ServiceType created successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "ServiceType",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.reset();
                                this.$router.push("/admin/service_type/");
                            } else if (res.status === 400) {
                                if (res.data === null) {
                                    this.$toast.error(res.message);
                                } else {
                                    let errors = res.data;
                                    for (let index in errors) {
                                        this.error[index] = errors[index];
                                    }
                                }
                            } else {
                                this.error_msg = res.message;
                                this.$toast.error(this.error_msg);
                            }
                            this.loading = false;
                        })
                        .catch((error) => {
                            // eslint-disable-next-line no-console
                            // console.log(error);
                            if (error.response) {
                                this.error_pit = error;
                                this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                                this.$toast.error(this.error_msg);
                            } else {
                                this.$toast.error("Network Error!");
                            }
                            this.loading = false;
                        });
                }
            },
            loadRoles: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/role/all", {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                })
                    .then((response) => {
                        //console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.roles = res.data;
                        } else {
                            this.$toast.error(res.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        //console.log(error);
                        this.$toast.error(error);
                        this.loading = false;
                    });
            },
        },
        data() {
            return {
                loading: false,
                title: "Create Service Type",
                action: "Create",
                update: false,
                id: "",
                name: "",
                description: "",
                RoleId: -1,
                roles: [],
                tags: [],
                error: {
                    name: "",
                    description: "",
                    RoleId: "",
                    test: ""
                },
            };
        },
        computed: {},
    };
</script>
