<template>
    <modal name="update-response-status" transition="pop-out" :width="modalWidth" :focus-trap="true" :height="300" @before-close="beforeClose" @before-open="beforeOpen">
        <div class="p-3 h-full w-full overflow-auto flex flex-col place-items-center">
            <h3 class="font-semibold text-2xl mb-5">Update Response Status</h3>
            <hr class="w-full mb-5 border-gray-100"/>

            <div class="w-full flex-row my-4 flex px-5 justify-center">
                <div class="form-check form-switch">
                    <input v-model="success" class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-gray-400 bg-no-repeat bg-contain bg-gray-700 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
                    <label class="form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Maintenance was successful!</label>
                </div>
            </div>

            <div v-if="!loading" class="mt-5">
                <button class="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 active:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
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
        name: 'AddResponseModal',
        created() {
            this.modalWidth =
                window.innerWidth < MODAL_WIDTH ? MODAL_WIDTH / 2 : MODAL_WIDTH;
        },
        methods: {
            beforeOpen: function(event){
                this.data = event.params;
                this.success = event.params['ServiceResponse']['success'];
            },
            beforeClose: function(){
                this.resetError();
                this.data = null;
                this.success = false;
            },
            submit: async function () {
                this.loading = true;
                let formData = new FormData();
                formData.append('id', this.data['ServiceResponse']['id']);
                formData.append('value', this.success);
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/service_response/status", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                    data: formData
                })
                    .then((response) => {
                        // eslint-disable-next-line no-console
                        // console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.$toast.success("Response status updated successfully!");
                            this.$router.push('/employee/home');
                        } else {
                            this.$toast.error(res.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        //console.log(error);
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
                };
            },
        },
        data() {
            return {
                loading: false,
                data: null,
                success: false,
                modalWidth: MODAL_WIDTH,
                error: {
                    comment: '',
                },
                error_msg: ''
            }
        },
    }
</script>
<style>
</style>