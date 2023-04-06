<template>
    <div @click="setNotificationSeen" class="flex items-center px-2 py-4 hover:bg-primary-light ">
        <Icon :name="icon"
              class="mx-1 flex-shrink-0 w-8 h-8 text-primary-normal bg-gray-1"
              notify
              round
              size="5"/>
        <div class="flex flex-col items-start mx-3">
            <p class="content text-left text-black-1 text-base mt-2 h-12">{{ content }}</p>
            <div class="w-full flex flex-row justify-between">
                <p class="text-gray-1 text-xs mt-1 place-self-center">{{parse(time)}}</p>
                <p class="text-black text-xs place-self-center bg-primary-normal rounded p-1 text-white" v-if="!seen">
                    New</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Icon from "./Icon";
    import moment from "moment";
    import axios from "axios";
    import {mapGetters} from 'vuex'

    export default {
        name: "Notification",
        components: {Icon},
        props: {
            isVisible: Boolean,
            id: Number,
            SR_id: Number,
            seen: Boolean,
            content: String,
            time: String
        },
        computed: mapGetters({
            User: 'getUser',
            AuthType: 'AuthType',
            AuthToken: 'AuthToken',
            AuthStatus: 'AuthStatus',
            API: 'API',
        }),
        methods: {
            setNotificationSeen: async function () {
                let formData = new FormData();
                formData.append('id', this.$props.SR_id);
                if (!this.$store.getters.AuthStatus) return;
                await axios(this.$store.getters.API + "/api/service_request/get", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": this.$store.getters.AuthToken,
                    },
                    data: formData
                })
                    .then((response) => {
                        // // eslint-disable-next-line no-console
                        // console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.data = res.data;
                            let prevId = -1;
                            if (this.$store.getters.UDF['data'] !== null) {
                                prevId = this.$store.getters.UDF['data']['id'];
                            }
                            if (this.AuthType === "User") {
                                this.$store.commit('setUserUpdate', {type: 'Item', val: true, data: this.data});
                                if (this.$router.currentRoute.fullPath !== "/user/forms/detail") {
                                    this.$router.push('/user/forms/detail');
                                } else if (prevId !== this.data['id']) {
                                    this.$router.push({'path': '/user/forms/detail', query: {"foo": ""}});
                                }
                            } else if (this.AuthType === "Employee") {
                                this.$store.commit('setEmployeeUpdate', {type: 'Item', val: true, data: this.data});
                                if (this.$router.currentRoute.fullPath !== "/employee/requests/detail") {
                                    this.$router.push('/employee/requests/detail');
                                } else if (prevId !== this.data['id']) {
                                    this.$router.push({'path': '/employee/requests/detail', query: {"foo": ""}});
                                }
                            } else if (this.AuthType === "Manager") {
                                this.$store.commit('setManagerUpdate', {type: 'Item', val: true, data: this.data});
                                if (this.$router.currentRoute.fullPath !== "/manager/requests/detail") {
                                    this.$router.push('/manager/requests/detail');
                                } else if (prevId !== this.data['id']) {
                                    this.$router.push({'path': '/manager/requests/detail', query: {"foo": ""}});
                                }
                            }
                            this.closeSidebar();
                        } else {
                            this.$toast.error(res.message);
                        }
                    })
                    .catch((error) => {
                        // // eslint-disable-next-line no-console
                        // console.log(error);
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
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            closeSidebar() {
                this.$store.getters.SideBarFun()
            },
        },
        data() {
            return {
                data: null,
                title: '',
                icon: 'comment'
            }
        },
    }
</script>

<style scoped>
    div:first-child {
        transition: all .25s linear;
    }

    .content {
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>