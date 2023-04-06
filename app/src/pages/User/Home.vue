<template>
    <main class="flex p-10 max-h-full">
        <div class="flex flex-col w-full h-full">
            <!-- Jumbotron -->
            <div
                    class="mx-auto p-6 shadow-lg rounded-lg bg-primary-light text-gray-900"
            >
                <h2 class="font-semibold text-3xl mb-5">{{ title }}</h2>

                <hr class="my-6 border-blue-600"/>

                <div class="flex flex-row">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <select
                                @click="resetError"
                                aria-label="Service Type"
                                class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                v-model="ServiceTypeId"
                        >
                            <option :value="-1" disabled>Service Type</option>
                            <option
                                    :value="service_type.id"
                                    v-bind:key="service_type.id"
                                    v-for="service_type in service_types"
                            >
                                {{ service_type.name }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-row">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_problem_issue_input"
                                placeholder="Issue"
                                type="text"
                                v-model="item"
                        />
                        <label class="text-gray-700" for="_problem_issue_input"
                        >Issue</label
                        >
                        <div class="text-sm mt-1 text-red-600" v-if="error['item']">
                            {{ error["item"] }}
                        </div>
                    </div>
                </div>

                <div :key="index" class="flex flex-row" v-for="(tag, index) in currentTags">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <input
                                :id="'__tag__input__' + index"
                                @click="resetError"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="Tag"
                                type="text"
                                v-model="tag.value"
                        />
                        <label :for="'__tag__input__' + index" class="text-gray-700"
                        >{{tag['name']}}</label
                        >
                        <div class="text-sm mt-1 text-red-600" v-if="error['__tag__input__' + index]">
                            {{ error['__tag__input__' + index] }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-row">
                    <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                        <label for="_problem_description_input" v-if="false"></label>
                        <textarea
                                @click="resetError"
                                class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="_problem_description_input"
                                placeholder="Detail problem description"
                                rows="5"
                                type="text"
                                v-model="description"
                        ></textarea>
                        <div class="text-sm mt-1 text-red-600" v-if="error['description']">
                            {{ error["description"] }}
                        </div>
                    </div>
                </div>

                <div class="flex flex-row">
                    <div class="w-full mx-5 mb-3 xl:w-96">
                        <input
                                @change="image_change"
                                accept="image/*"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="formFileMultiple"
                                multiple
                                placeholder="Images"
                                type="file"
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
        </div>
    </main>
</template>

<script>
    import axios from "axios";

    export default {
        name: "ManageServiceRequest",
        components: {},
        watch: {
            ServiceTypeId(id) {
                if (id === -1) {
                    this.currentTags = [];
                    return;
                }
                for(let st of this.service_types){
                    if(st['id'] === id){
                        this.currentTags = st["tags"];
                        return;
                    }
                }
                this.currentTags = [];
            },
        },
        created: function () {
            this.loadServiceTypes();
        },
        methods: {
            checkTagInput: function () {
                let d_tag = false;
                let that = this;
                this.currentTags.forEach(function (val) {
                    if (val['value'] === "" && !val['optional']) {
                        d_tag = true;
                        that.$toast.error(val['name'] + " can not be empty");
                    }
                });
                if (!d_tag) {
                    let desc_app = "\n\nTags\n";
                    this.currentTags.forEach(function (val) {
                        desc_app += val['name'] + ": " + val['value'] + "\n"
                    });
                    this.description += desc_app;
                }
                return d_tag;
            },
            reset: function () {
                this.item = "";
                this.description = "";
                this.ServiceTypeId = -1;
            },
            resetError: function () {
                this.error = {
                    item: "",
                    description: "",
                    ServiceTypeId: -1,
                };
            },
            Create: async function () {
                if (this.checkTagInput()) return;
                this.loading = true;
                let data = {
                    item: this.item,
                    description: this.description,
                    ServiceTypeId: this.ServiceTypeId,
                };
                let formData = new FormData();
                for (let key in data) {
                    formData.append(key, data[key]);
                }
                for (const i of Object.keys(this.imageArray)) {
                    formData.append("image", this.imageArray[i]);
                }
                if (!this.$store.getters.AuthStatus) return;
                await axios(this.$store.getters.API + "/api/service_request/create", {
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
                            this.$toast.success("Maintenance form submitted successfully!");
                            this.loading = false;
                            this.reset();
                            this.$router.push("/user/forms");
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
                            this.error_msg =
                                "Internal Server Error! (" + error.response.status + ")";
                            this.$toast.error(this.error_msg);
                        } else {
                            this.$toast.error("Network Error!");
                        }
                        this.loading = false;
                    });
            },
            loadServiceTypes: async function () {
                this.loading = true;
                if (!this.$store.getters.AuthStatus) return;
                await axios(this.$store.getters.API + "/api/service_type/all", {
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
                            this.service_types = res.data;
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
            image_change: function (event) {
                this.imageArray = event.target.files;
            },
        },
        data() {
            return {
                loading: false,
                title: "Maintenance Request Form",
                action: "Submit",
                description: "",
                item: "",
                ServiceTypeId: -1,
                currentTags: [],
                service_types: [],
                imageArray: [],
                images: [],
                error: {
                    description: "",
                    item: "",
                },
            };
        },
        computed: {},
    };
</script>
