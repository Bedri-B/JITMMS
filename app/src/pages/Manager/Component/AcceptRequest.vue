<template>
    <modal name="accept-request" transition="pop-out" :width="modalWidth" :focus-trap="true" :height="350" @before-close="beforeClose" @before-open="beforeOpen">
        <div class="p-3 h-full w-full overflow-auto flex flex-col place-items-center">
            <h3 class="font-semibold text-2xl mb-5">Assign Request</h3>
            <hr class="w-full mb-5 border-gray-100"/>
            <h3 class="font-semibold text-base mb-5" v-if="data">{{data['ServiceType']['name']}}</h3>
            <div class="w-full flex flex-row">
                <div class="w-full mx-5 form-floating mb-3 xl:w-96">
                    <select
                            @click="resetError"
                            aria-label="Employee"
                            class="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            v-model="EmployeeId"
                    >
                        <option :value="-1" disabled>Employee</option>
                        <option
                                :value="employee.id"
                                v-bind:key="employee.id"
                                v-for="employee in employees"
                        >
                            {{ employee['firstName'] }} {{ employee['lastName'] }} ({{employee['username']}})
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="!loading" class="mt-10">
                <button class="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-lg leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 active:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        type="button_"
                        @click="submit">
                    Submit
                </button>
            </div>
            <div
                    class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                    role="status"
                    v-if="loading"
            >
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </modal>
</template>
<script>
    import axios from 'axios'

    const MODAL_WIDTH = 450;
    export default {
        name: 'AcceptRequestModal',
        created() {
            this.modalWidth =
                window.innerWidth < MODAL_WIDTH ? MODAL_WIDTH / 2 : MODAL_WIDTH;
        },
        methods: {
            beforeOpen: function(event){
                this.data = event.params;
                this.loadEmployees();
            },
            beforeClose: function(){
                this.resetError();
                this.data = null;
                this.EmployeeId = -1;
                this.employees = [];
            },
            loadEmployees: async function () {
                this.loading = true;
                let formData = new FormData();
                formData.append('ServiceTypeId', this.data['ServiceTypeId']);
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/employee/all", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                    data: formData
                })
                    .then((response) => {
                        //console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.employees = res.data;
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
            submit: async function () {
                this.loading = true;
                if(this.EmployeeId === -1){
                    this.$toast.error("Please select an employee!");
                    this.loading = false;
                    return;
                }
                let formData = new FormData();
                formData.append('id', this.data['id']);
                formData.append('EmployeeId', this.EmployeeId);
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/service_request/accept", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                    data: formData
                })
                    .then((response) => {
                        //console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.$toast.success("Request assigned successfully!");
                            this.$router.push('/manager/requests/new');
                        } else {
                            this.$toast.error(res.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        if (error.response) {
                            this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                            this.$toast.error(this.error_msg);
                        } else {
                            this.$toast.error("Network Error!");
                        }
                        this.loading = false;
                    });
            },
            resetError:function() {
                this.error =  {
                    data: null,
                    EmployeeId: '',
                };
            },
        },
        data() {
            return {
                loading: false,
                data: null,
                modalWidth: MODAL_WIDTH,
                EmployeeId: -1,
                employees: [],
                error: {
                    EmployeeId: '',
                },
                error_msg: ''
            }
        },
    }
</script>
<style>
</style>