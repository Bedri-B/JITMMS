<template>
    <article :class="{ 'is-open': isVisible }"
             class="fixed w-72 h-screen bg-white border-l border-gray-3 border-solid shadow-2l">
        <div>
            <header class="h-1/6 flex justify-between items-center px-6 py-8 border-b border-gray-3 border-solid">
                <div class="flex flex-col place-content-start items-center">
                    <span class="text-black-1 text-bg mr-2">{{User['firstName']}} {{User['lastName']}}</span>
                    <p class="text-gray-0 text-sm">{{User['role']}}</p>
                </div>

                <Button @click.native="Logout"
                        class="w-24 bg-gray-2 text-black-3 hover:bg-primary-normal hover:text-white focus:outline-none"
                        rounded>
                    Logout
                </Button>
            </header>
            <ul v-if="AuthType !== 'Admin'">
                <li class="border-b border-gray-3 border-solid flex gap-1 p-1">
                    <Button
                            class="w-1/2 bg-gray-2 text-black-3 hover:bg-primary-normal hover:text-white focus:outline-none"
                            rounded
                            @click.native="refreshNotification">
                        Refresh
                    </Button>
                    <Button @click.native="clearNotifications"
                            class="w-1/2 bg-gray-2 text-black-3 hover:bg-primary-normal hover:text-white focus:outline-none"
                            rounded
                            v-bind:active="notifications.length > 0">
                        Clear
                    </Button>
                </li>
            </ul>
        </div>
        <ul class="h-4/6 overflow-auto" v-if="notifications.length > 0 && AuthType !== 'Admin'">
            <li :key="index" class="border-b border-gray-3 border-solid" v-for="(notification, index) in notifications">
                <Notification :content="notification['content']" :time="notification['createdAt']"
                              :seen="notification['seen']" :id="notification['id']"
                              :SR_id="notification['ServiceRequestId']" :isVisible="isVisible"
                              class="cursor-pointer"/>
            </li>
        </ul>
    </article>
</template>

<script>
    import Button from "./Button";
    import Notification from "./Notification";
    import {mapGetters} from 'vuex'

    export default {
        name: "SideBar",
        components: {
            Button,
            Notification
        },
        props: {
            isVisible: {
                type: Boolean,
                default: false
            },

        },
        computed: mapGetters({
            notifications: "Notifications",
            notificationService: "NotificationService",
            User: 'getUser',
            AuthType: 'AuthType',
            AuthToken: 'AuthToken',
            AuthStatus: 'AuthStatus',
            API: 'API',
        }),
        data() {
            return {}
        },
        methods: {
            refreshNotification(){
                this.notificationService(true);
            },
            clearNotifications() {
                this.$store.commit("clearNotifications");
            },
            Logout: function () {
                this.$store.commit('Logout');
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>
    article {
        top: 80px;
        right: -18rem;
        opacity: 0;
        transition: transform .25s cubic-bezier(0.4, 0.0, 0.2, 1),
        opacity .30s linear;
    }

    article.is-open {
        transform: translateX(-18rem);
        opacity: 1;
    }
</style>