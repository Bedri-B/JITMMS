<template>
    <main class="flex flex-wrap items-start p-10 w-5/6 max-h-full">
        <div class="flex flex-row">
            <h1 class="text-2xl flex-initial leading-none text-black-1 mr-2">Requests</h1>
        </div>
        <div class="flex justify-between gap-20 items-start w-full mt-10">
            <task-lane :items="items['pending']" class="w-full mr-6" id="pending" title="Pending Approval"></task-lane>
        </div>
    </main>
</template>

<script>
    import TaskLane from "../../components/EmployeeTaskLane";
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
        await axios(this.$store.getters.API + "/api/service_request/mine", {
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
                            this.$store.commit('setEmployeeUpdate', {type: 'Forms', val: true, data: this.data});
                            this.items.pending = [];
                            for(let sr of res.data){
                                if(sr['assigned'] && sr['completed'] && sr['pending']) this.items.pending.push(sr);
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
                    new: [],
                    pending: [],
                },
            }
        },
    }
</script>

<style scoped>
</style>