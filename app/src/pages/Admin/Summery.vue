<template>
    <div class="flex p-10 flex-col max-h-full">
        <h1 class="text-2xl leading-none text-black-1 mr-2 mb-10">Summery</h1>
        <div class="place-content-center flex flex-wrap gap-4 mx-auto mt-3" v-if="!loading">
            <RouterLink class="w-64" to="/admin/manager">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-person-workspace" style="font-size: 3rem"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['manager']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Manager(s)</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/admin/employee">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-person-badge" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['employee']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Employee(s)</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/admin/user">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-people-fill" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['user']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">User(s)</h5>
                    </section>
                </Card>
            </RouterLink>
        </div>
        <div class="place-content-center flex flex-wrap gap-4 mx-auto mt-3" v-if="!loading">
            <RouterLink class="w-64" to="/admin/role">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-person-lines-fill" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['role']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Role(s)</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/admin/user_type">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-people" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['user_type']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">User Type(s)</h5>
                    </section>
                </Card>
            </RouterLink>
            <RouterLink class="w-64" to="/admin/service_type">
                <Card class="w-64 mx-auto flex_b">
                    <header class="w-full flex justify-between items-center mx-5 my-10">
                        <i class="bi bi-gear-wide-connected" style="font-size: 3rem;"></i>
                    </header>
                    <section class="my-5 ml-3 mr-10">
                        <h3 class="text-3xl font-bold mt-0 mb-1">{{data['service_type']['total']}}</h3>
                        <h5 class="text-1xl font-bold mb-2">Service Type(s)</h5>
                    </section>
                </Card>
            </RouterLink>
        </div>
        <div class="w-full mt-10">
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
        name: "Analytics",
        components: {
            Card,
        },
        created: function () {
            this.loadCount();
        },
        methods: {
            loadCount: async function () {
                this.loading = true;
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/admin/count', {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken
                    }
                }).then((response) => {
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        this.data = res.data;
                    } else {
                        this.$toast.error(res.message);
                    }
                    this.loading = false;
                }).catch((error) => {
                    // console.log(error);
                    this.$toast.error(error.toString());
                    this.loading = false;
                });

            },
        },
        data() {
            return {
                loading: true,
                data: {
                    'user': {total: 0, active: 0, inactive: 0},
                    'manager': {total: 0, active: 0, inactive: 0},
                    'employee': {total: 0, active: 0, inactive: 0},
                    'role': {total: 0},
                    'user_type': {total: 0},
                    'service_type': {total: 0},
                }
            }
        },
        mounted() {

        }
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