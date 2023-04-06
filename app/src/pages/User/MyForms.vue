<template>
    <main class="flex flex-wrap items-start p-10 w-5/6 max-h-full">
        <div class="flex flex-row">
            <h1 class="text-2xl flex-initial leading-none text-black-1 mr-2">My Forms</h1>
        </div>
        <div class="flex justify-between gap-10 items-start w-full mt-5">
            <task-lane :items="items['rejected']" class="w-1/2 mr-6" id="rejected" title="Rejected"></task-lane>
            <task-lane :items="items['pending']" class="w-1/2 mr-6" id="pending" title="Pending"></task-lane>
            <task-lane :items="items['assigned']" class="w-1/2 mr-6" id="assigned" title="Assigned"></task-lane>
            <task-lane :items="items['completed']" class="w-1/2 mr-6" id="completed" title="Completed"></task-lane>
        </div>
    </main>
</template>

<script>
    import TaskLane from "../../components/UserTaskLane";
    import axios from 'axios'

    export default {
        name: "MyForms",
        components: {
            TaskLane,
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
                            this.$store.commit('setUserUpdate', {type: 'Forms', val: true, data: this.data});
                            this.items.pending = [];
                            this.items.rejected = [];
                            this.items.assigned = [];
                            this.items.completed = [];
                            for(let sr of res.data){
                                if(!sr['assigned'] && !sr['rejected']) {
                                    this.items.pending.push(sr);
                                    continue;
                                }
                                if(sr['rejected']) {
                                    this.items.rejected.push(sr);
                                    continue;
                                }
                                if(sr['assigned'] && !sr['completed']) {
                                    this.items.assigned.push(sr);
                                    continue;
                                }
                                if(sr['completed']) {
                                    this.items.completed.push(sr);
                                }
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
                    rejected: [],
                    pending: [],
                    assigned: [],
                    completed: []
                },
            }
        },
    }
</script>

<style scoped>
</style>