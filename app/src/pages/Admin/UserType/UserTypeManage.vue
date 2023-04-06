<template>
    <main class="flex flex-col w-full p-10 max-h-full">
        <!-- Jumbotron -->
        <div class="mx-auto p-6 shadow-lg rounded-lg bg-primary-light text-gray-900">
            <h2 class="font-semibold text-3xl mb-5">{{ title }}</h2>

            <hr class="my-6 border-blue-600"/>

            <div class="flex flex-row">
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

            <div class="flex flex-row">
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
        name: "ManageUserType",
        components: {},
        created: function () {
            if (this.$store.getters.AUTU) {
                this.title = "Update User Type";
                this.action = "Update";
                this.update = true;
                let data = this.$store.getters.AUTD;
                this.id = data["id"];
                this.name = data["name"];
                this.description = data["description"];

                this.$store.commit('setAdminUpdate', {type: 'UserType', val: false, data: null});
            }
        },
        methods: {
            reset: function () {
                this.id = "";
                this.name = "";
                this.description = "";
            },
            resetError: function () {
                this.error = {
                    name: "",
                    description: "",
                };
            },
            Create: async function () {
                this.loading = true;
                if (this.update) {
                    let data = {
                        id: this.id,
                        name: this.name,
                        description: this.description,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/user_type/update", {
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
                                this.$toast.success("UserType information updated successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "UserType",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.$router.push("/admin/user_type/");
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
                        name: this.name,
                        description: this.description,
                    };
                    let formData = new FormData();
                    for (let key in data) {
                        formData.append(key, data[key]);
                    }
                    if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/user_type/create", {
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
                                this.$toast.success("UserType created successfully!");
                                this.$store.commit("setAdminUpdate", {
                                    type: "UserType",
                                    val: false,
                                    data: null,
                                });
                                this.loading = false;
                                this.reset();
                                this.$router.push("/admin/user_type/");
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
        },
        data() {
            return {
                loading: false,
                title: "Create User Type",
                action: "Create",
                update: false,
                id: "",
                name: "",
                description: "",
                error: {
                    name: "",
                    description: "",
                },
            };
        },
        computed: {},
    };
</script>
