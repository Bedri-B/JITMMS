<template>
    <main class="flex flex-col gap-4 p-10 w-full max-h-full">
        <div class="flex flex-row">
            <h1 class="text-2xl flex-initial leading-none text-black-1 mr-2">Requests</h1>
        </div>
        <div class="flex gap-10 items-start w-full">
            <task-lane :items="items['pending']" class="w-full mr-6" id="pending" title="New"></task-lane>
        </div>
    </main>
</template>

<script>
    import TaskLane from "../../components/ManagerTaskLane2";
    import axios from 'axios'

    export default {
        name: "NewRequests",
        components: {
            TaskLane
        },
        created: function () {
            this.loadMyServiceRequests();
        },
        methods: {
            loadMyServiceRequests: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + "/api/service_request/all", {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                })
                    .then((response) => {
                        // eslint-disable-next-line no-console
                        // console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.data = res.data;
                            this.$store.commit('setManagerUpdate', {type: 'Forms', val: true, data: this.data});
                            this.items.pending = [];
                            for(let sr of res.data){
                                if(!sr['assigned'] && !sr['rejected']) this.items.pending.push(sr);
                            }
                        } else {
                            this.$toast.error(res.message);
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        //console.log(error);
                        if(error.response){
                            this.error_pit = error;
                            this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                            this.$toast.error(this.error_msg);
                        }
                        else{
                            this.error_msg = "Network Error!";
                            this.$toast.error("Network Error!");
                        }
                        this.loading = false;
                    });
            },
        },
        data() {
            return {
                data: null,
                items: {
                    pending: [],
                },
            }
        },
    }
</script>

<style scoped>
</style>