<template>
    <main class="flex flex-col w-full p-10 max-h-full">
        <!-- Jumbotron -->
        <div class="mx-auto w-4/5 p-6 shadow-lg rounded-lg bg-primary-light text-gray-900">
            <h2 class="font-semibold text-3xl mb-5">{{ title }}</h2>

            <hr class="my-6 border-blue-600"/>

            <div class="flex flex-row">
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="_first_name_input"
                            placeholder="First Name"
                            type="text"
                            v-model="firstName"
                    />
                    <label class="text-gray-700" for="_first_name_input"
                    >First Name</label
                    >
                    <div class="text-sm mt-1 text-red-600" v-if="error['firstName']">
                        {{ error["firstName"] }}
                    </div>
                </div>
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="_last_name_input"
                            placeholder="Last Name"
                            type="text"
                            v-model="lastName"
                    />
                    <label class="text-gray-700" for="_last_name_input"
                    >Last Name</label
                    >
                    <div class="text-sm mt-1 text-red-600" v-if="error['lastName']">
                        {{ error["lastName"] }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row" v-if="!update">
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="_username_input"
                            placeholder="Username"
                            type="text"
                            v-model="username"
                    />
                    <label class="text-gray-700" for="_username_input">Username</label>
                    <div class="text-sm mt-1 text-red-600" v-if="error['username']">
                        {{ error["username"] }}
                    </div>
                </div>
                <div class="mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="floatingPassword"
                            placeholder="Password"
                            type="text"
                            v-model="password"
                    />
                    <label class="text-gray-700" for="floatingPassword">Password</label>
                    <div class="text-sm mt-1 text-red-600" v-if="error['password']">
                        {{ error["password"] }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row">
                <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                    <input
                            @click="resetError"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id="_phone_number_input"
                            placeholder="Username"
                            type="text"
                            v-model="phone_number"
                    />
                    <label class="text-gray-700" for="_phone_number_input"
                    >Phone Number</label
                    >
                    <div class="text-sm mt-1 text-red-600" v-if="error['phone_number']">
                        {{ error["phone_number"] }}
                    </div>
                </div>
                <div class="w-full mx-5 form-floating mb-3 xl:w-96">
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

            <div class="flex flex-row mt-5" v-if="update">
                <div class="form-check form-switch mx-5">
                    <label
                            class="form-check-label inline-block text-gray-800"
                            for="flexSwitchCheckDefault"
                    >Active</label
                    >
                    <input
                            class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-grey-700 bg-no-repeat bg-contain bg-gray-700 focus:outline-none cursor-pointer shadow-sm"
                            id="flexSwitchCheckDefault"
                            role="switch"
                            type="checkbox"
                            v-model="active"
                    />
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
        name: "ManageEmployee",
        components: {},
        created: function () {
            this.loadRoles();
            if (this.$store.getters.AEU) {
                this.title = "Update Employee";
                this.action = "Update";
                this.update = true;
                let data = this.$store.getters.AED;
                this.id = data["id"];
                this.active = data["active"];
                this.firstName = data["firstName"];
                this.lastName = data["lastName"];
                this.phone_number = data["phone_number"];
                this.RoleId = data["RoleId"];

                this.$store.commit('setAdminUpdate', {type: 'Employee', val: false, data: null});
            }
        },
        methods: {
            reset: function () {
                this.firstName = "";
                this.id = "";
                this.active = "";
                this.lastName = "";
                this.phone_number = "";
                this.password = "";
                this.username = "";
                this.RoleId = -1;
            },
            resetError: function () {
                this.error = {
                    firstName: "",
                    lastName: "",
                    phone_number: "",
                    password: "",
                    username: "",
                    RoleId: -1,
                };
            },
            Create: async function () {
                this.loading = true;
                if (this.update) {
                    let data = {
                        id: this.id,
                        active: this.active,
                        firstName: this.firstName,
                        lastName: this.lastName,
                        phone_number: this.phone_number,
                        RoleId: this.RoleId,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if (!this.$store.getters.AuthStatus) return;
                    await axios(this.$store.getters.API + "/api/employee/update", {
                        method: "post",
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "x-access-token": this.$store.getters.AuthToken,
                        },
                        data: formData,
                    })
                        .then((response) => {
                            // eslint-disable-next-line no-console
                            // console.log(response);
                            let res = response.data;
                            if (res.status === 200) {
                                this.$toast.success("Employee information updated successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "Employee",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.$router.push("/admin/employee/");
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
                            //console.log(error);
                            if (error.response) {
                                this.error_pit = error;
                                this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                                this.$toast.error(this.error_msg);
                            } else {
                                this.$toast.error("Network Error!");
                            }
                            this.loading = false;
                        });
                } else {
                    let data = {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        phone_number: this.phone_number,
                        password: this.password,
                        username: this.username,
                        RoleId: this.RoleId,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if (!this.$store.getters.AuthStatus) return;
                    await axios(this.$store.getters.API + "/api/employee/create", {
                        method: "post",
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "x-access-token": this.$store.getters.AuthToken,
                        },
                        data: formData,
                    })
                        .then((response) => {
                            // eslint-disable-next-line no-console
                            // console.log(response);
                            let res = response.data;
                            if (res.status === 200) {
                                this.$toast.success("Employee created successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "Employee",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.reset();
                                this.$router.push("/admin/employee/");
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
                            //console.log(error);
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
                if (!this.$store.getters.AuthStatus) return;
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
                        if (error.response) {
                            this.error_pit = error;
                            this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                            this.$toast.error(this.error_msg);
                        } else {
                            this.$toast.error("Network Error!");
                        }
                        this.loading = false;
                    });
            },
        },
        data() {
            return {
                loading: false,
                title: "Create Employee",
                action: "Create",
                update: false,
                id: "",
                active: "",
                firstName: "",
                lastName: "",
                phone_number: "",
                password: "",
                username: "",
                RoleId: -1,
                roles: [],
                error: {
                    firstName: "",
                    lastName: "",
                    phone_number: "",
                    password: "",
                    username: "",
                },
            };
        },
        computed: {},
    };
</script>
