<template @sidebar="openSideBar">
    <div id="app" v-bind:class="logged_in ? 'overflow-hidden main_container_app' : 'overflow-auto'">
        <main class="__width_vw" v-if="!logged_in">
            <router-view class="min-h-screen max-h-screen" v-if="!logged_in"/>
        </main>
        <Nav :menu-list-item="menuListItems" :user="user" class="hidden md:block h-screen" v-if="logged_in"></Nav>
        <header class="relative bg-white flex flex-row px-2 lg:pl-10 border-b border-gray-3 border-solid"
                v-if="logged_in">
            <Nav :menu-list-item="menuListItems" :user="user" class="md:hidden" mode="mobile"></Nav>
            <div class="flex items-center">
                <img alt="JIT MMS" height="24" src="./assets/logo.png" width="22">
                <span class="ml-3">JIT MMS</span>
            </div>
            <div class="flex items-center inset-y-0 right-0 absolute">
                <Button @click.native="openSideBar"
                        class="mx-2 relative text-gray-1 hover:text-primary-normal no-focus"
                        round>
                    <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-normal" v-if="newCount"></span>
                    <svg class="fill-current"
                         height="35"
                         width="35"
                         xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">
                        <use xlink:href="#c-icon-bell"></use>
                    </svg>
                </Button>
                <Button @click.native="openSideBar"
                        class="mx-2  relative text-gray-1 hover:text-primary-normal no-focus"
                        round>
                    <svg class="fill-current"
                         height="35"
                         width="35"
                         xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">
                        <use xlink:href="#c-icon-settings"></use>
                    </svg>
                </Button>
            </div>
        </header>
        <router-view class="min-h-full max-w-screen m-auto w-full overflow-auto"
                     v-if="logged_in"/>
        <SideBar :is-visible="isOpenSideBar" v-if="logged_in"></SideBar>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Nav from './components/Nav'
    import Button from "./components/Button"
    import SideBar from "./components/SideBar"
    import axios from "axios";

    export default {
        name: 'app',
        components: {
            Nav,
            Button,
            SideBar,
        },
        created: async function () {
            if (!this.logged_in) {
                let data = localStorage.getItem('cookie');
                if (data !== null) {
                    let token = localStorage.getItem('token');
                    await axios(this.API + '/api/auth/valid', {
                        headers: {
                            "x-access-token": token
                        },
                        method: "post",
                    }).then((response) => {
                        // eslint-disable-next-line no-console
                        // console.log(response);
                        let res = response.data;
                        if (res.status === 200) {
                            this.$store.commit('setAuthToken', token);
                            this.$store.commit('setAuthType', res.data['type']);
                            this.$store.commit('setAuthStatus', true);
                            this.$store.commit('setAuthUser', res.data);
                        } else {
                            localStorage.clear();
                        }
                    }).catch((error) => {
                        //console.log(error);
                        this.error_pit = error;
                        this.error = error;
                        localStorage.clear();
                    });
                }
            }
            this.logged_in = this.AuthStatus;
            if (this.logged_in) {
                this.menuListItems = this.MenuListItem;
                this.user = this.User;
            }
        },
        updated: function () {
            this.logged_in = this.AuthStatus;
            if (this.logged_in) {
                this.menuListItems = this.MenuListItem;
                this.user = this.User;
                if (this.AuthType !== "Admin" && !this.notificationServiceRunning) {
                    this.notificationService(false);
                    this.$store.commit("NotificationService", this.notificationService);
                    this.$store.commit("SidebarFun", this.openSideBar);
                }
            } else {
                this.menuListItems = null;
                this.user = null;
                this.isOpenSideBar = false;
            }
        },
        computed: mapGetters({
            notifications: 'Notifications',
            newCount: 'NewNotificationCount',
            AuthToken: 'AuthToken',
            MenuListItem: 'getMenuListItem',
            User: 'getUser',
            AuthStatus: 'AuthStatus',
            AuthType: 'AuthType',
            API: 'API',
        }),
        data() {
            return {
                loading: false,
                update_interval: 60000, //Update notifications every one minute
                notificationServiceRunning: false,
                notification: 0,
                error: '',
                logged_in: this.$store.getters.AuthStatus,
                menuListItems: null,
                user: null,
                isOpenSideBar: false,
                error_pit: ''
            }
        },
        methods: {
            notificationService: async function (oneTime) {
                if (this.loading || !this.AuthStatus) return;
                this.loading = true;
                this.notificationServiceRunning = oneTime ? this.notificationServiceRunning : true;
                if (!this.$store.getters.AuthStatus) return;
                await axios(this.API + '/api/notification/mine', {
                    headers: {
                        "x-access-token": this.AuthToken
                    },
                    method: "get",
                }).then((response) => {
                    // eslint-disable-next-line no-console
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        this.$store.commit("Notification", res.data);
                        let that = this;
                        if (!oneTime) {
                            setTimeout(function () {
                                that.notificationService(false);
                            }, this.update_interval)
                        }
                        this.loading = false;
                    } else {

                        if (this.AuthStatus) {
                            this.$toast.error(res.message);
                        }
                        this.loading = false;
                    }
                }).catch((error) => {
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
            openSideBar: function () {
                this.isOpenSideBar = !this.isOpenSideBar;
            }
        }
    }
</script>

<style >
    .main_container_app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        display: grid;
        background-color: #F4F6FC;
        grid-template-columns: 100%;
        grid-template-rows: 1fr;
        grid-template-areas: "head" "main";
        max-height: 100vh;
    }

    #app > header {
        grid-area: head;
    }

    .__width_vw {
        width: 100vw;
    }

    main {
        grid-area: main;
    }

    @media (min-width: 768px) {
        .main_container_app {
            grid-template-columns: auto 1fr;
            grid-template-rows: 80px 1fr;
            grid-template-areas: "nav head" "nav main";
        }


    }

    .no-focus:focus {
        outline: none;
    }

    @media (max-width: 600px) {
        .main_container_app {
            min-width: 600px;
            overflow: auto;

            grid-template-columns: 1fr;
            grid-template-rows: 80px 1fr;
            grid-template-areas: "head" "main";

            max-height: 100vh;
        }
    }


    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 0;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: #555;
    }

    p {
        word-break: break-word;
    }

</style>
