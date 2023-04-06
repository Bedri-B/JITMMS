<template>
    <main class="flex flex-col w-full p-10 max-h-full">
            <!-- Jumbotron -->
            <div class=" mx-auto w-4/5 p-6 shadow-lg rounded-lg bg-primary-light text-gray-900">
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
                                aria-label="UserType"
                                class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                v-model="UserTypeId"
                        >
                            <option :value="-1" disabled>User Type</option>
                            <option
                                    :value="user_type.id"
                                    v-bind:key="user_type.id"
                                    v-for="user_type in user_types"
                            >
                                {{ user_type.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_user_id_input"
                                placeholder="ID"
                                type="text"
                                v-model="user_id"
                        />
                        <label class="text-gray-700" for="_user_id_input">ID</label>
                        <div class="text-sm mt-1 text-red-600" v-if="error['user_id']">
                            {{ error["user_id"] }}
                        </div>
                    </div>
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_building_no_input"
                                placeholder="Building ID"
                                type="text"
                                v-model="building_no"
                        />
                        <label class="text-gray-700" for="_building_no_input"
                        >Building ID</label
                        >
                        <div class="text-sm mt-1 text-red-600" v-if="error['building_no']">
                            {{ error["building_no"] }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_room_no_input"
                                placeholder="Room Number"
                                type="text"
                                v-model="room_no"
                        />
                        <label class="text-gray-700" for="_room_no_input"
                        >Office/Room Number</label
                        >
                        <div class="text-sm mt-1 text-red-600" v-if="error['room_no']">
                            {{ error["room_no"] }}
                        </div>
                    </div>
                    <div class="invisible w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_place_holder_building_no_input"
                                placeholder="ID"
                                type="text"
                        />
                        <label class="text-gray-700" for="_place_holder_building_no_input"
                        >Building ID</label
                        >
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
        name: "ManageUser",
        components: {},
        created: function () {
            this.loadUserTypes();
            if (this.$store.getters.AUU) {
                this.title = "Update User";
                this.action = "Update";
                this.update = true;
                let data = this.$store.getters.AUD;
                this.id = data["id"];
                this.active = data["active"];
                this.firstName = data["firstName"];
                this.lastName = data["lastName"];
                this.phone_number = data["phone_number"];
                this.user_id = data["user_id"];
                this.room_no = data["room_no"];
                this.building_no = data["building_no"];
                this.UserTypeId = data["UserTypeId"];

                this.$store.commit("setAdminUpdate", {
                    type: "User",
                    val: false,
                    data: null,
                });
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
                this.user_id = "";
                this.room_no = "";
                this.building_no = "";
                this.UserTypeId = -1;
            },
            resetError: function () {
                this.error = {
                    firstName: "",
                    lastName: "",
                    phone_number: "",
                    password: "",
                    username: "",
                    room_no: "",
                    building_no: "",
                    user_id: "",
                    UserTypeId: -1,
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
                        UserTypeId: this.UserTypeId,
                        room_no: this.room_no,
                        building_no: this.building_no,
                        user_id: this.user_id,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/user/update", {
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
                                this.$toast.success("User information updated successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "User",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.$router.push("/admin/user/");
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
                } else {
                    let data = {
                        firstName: this.firstName,
                        lastName: this.lastName,
                        phone_number: this.phone_number,
                        password: this.password,
                        username: this.username,
                        UserTypeId: this.UserTypeId,
                        room_no: this.room_no,
                        building_no: this.building_no,
                        user_id: this.user_id,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/user/create", {
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
                                this.$toast.success("User created successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "User",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.reset();
                                this.$router.push("/admin/user/");
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
            loadUserTypes: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/user_type/all", {
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
                            this.user_types = res.data;
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
                title: "Create User",
                action: "Create",
                update: false,
                id: "",
                active: "",
                firstName: "",
                lastName: "",
                phone_number: "",
                password: "",
                username: "",
                room_no: "",
                building_no: "",
                user_id: "",
                UserTypeId: -1,
                user_types: [],
                error: {
                    firstName: "",
                    lastName: "",
                    phone_number: "",
                    password: "",
                    username: "",
                    room_no: "",
                    building_no: "",
                    user_id: "",
                },
            };
        },
        computed: {},
    };
</script>
