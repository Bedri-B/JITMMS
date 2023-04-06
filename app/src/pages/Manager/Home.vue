<template>
    <div class="flex p-10 flex-col max-h-full">
        <h1 class="text-2xl leading-none text-black-1 mr-2 mb-10">Request Summery</h1>
        <div class="place-content-center flex flex-wrap gap-4 mx-auto mt-3" v-if="!loading">
            <RouterLink class="w-64" to="/manager/requests/new">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-ui-checks-grid" style="font-size: 3rem"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{items['new'].length}}</h3>
                        <h5 class="text-1xl font-bold mb-2">New</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/manager/requests/assigned">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-ui-checks" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-5">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{items['assigned'].length}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Accepted/Assigned</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/manager/requests/assigned">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-pencil-square" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{items['completed'].length}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Feedback</h5>
                    </section>
                </Card>
            </RouterLink>
        </div>
        <div class="place-content-center flex flex-wrap gap-4 mx-auto mt-3" v-if="!loading">

            <RouterLink class="w-64" to="/manager/archive">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-x-octagon" style="font-size: 3rem"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{items['rejected'].length}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Rejected</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/manager/archive">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-archive" style="font-size: 3rem"></i>
                    </header>
                    <section class="my-5 ml-3 mr-5">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{items['archived'].length}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Approved/Archived</h5>
                    </section>
                </Card>
            </RouterLink>
        </div>
        <div class="w-full mt-10" v-if="loading">
            <div class="spinner-border place-content-center animate-spin inline-block w-8 h-8 border-4 rounded-full"
                 role="status"
                 v-if="loading">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from "../../components/Card";
    import axios from 'axios'

    export default {
        name: "MyForms",
        components: {Card},
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
                            this.$store.commit('setUserUpdate', {type: 'Forms', val: true, data: this.data});
                            this.items.new = [];
                            this.items.completed = [];
                            this.items.assigend = [];
                            this.items.archived = [];
                            this.items.rejected = [];

                            for (let sr of res.data) {
                                if (sr['rejected']) {
                                    this.items.rejected.push(sr);
                                    continue;
                                }
                                if (sr['pending'] && !sr['assigned']) {
                                    this.items.new.push(sr);
                                    continue;
                                }
                                if (sr['assigned'] && !sr['completed']) {
                                    this.items.assigned.push(sr);
                                    continue;
                                }

                                if (sr['assigned'] && sr['completed'] && sr['pending']) {
                                    this.items.completed.push(sr);
                                    continue;
                                }

                                if (!sr['pending'] && sr['completed']) {
                                    this.items.archived.push(sr);
                                }
                            }

                        } else {
                            this.$toast.error(res.message);
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
                            this.error_msg = "Network Error!";
                            this.$toast.error("Network Error!");
                        }
                        this.loading = false;
                    });
            },
        },
        data() {
            return {
                loading: false,
                data: null,
                items: {
                    new: [],
                    assigned: [],
                    completed: [],
                    archived: [],
                    rejected: []
                },
            }
        },
    }
</script>

<style scoped>
    .flex_b {
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 175px;
    }
</style>