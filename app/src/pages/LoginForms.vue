<template>
    <modal
            :focus-trap="true"
            :height="400"
            :width="modalWidth"
            name="login-forms"
            transition="pop-out"
    >
        <div class="flex flex-col text-black text-center m-auto gap-12 p-10">
            <div class="text-5xl">Welcome</div>
            <div class="w-100 flex flex-col md:flex-col text-center gap-4">
                <div :key="index" class="w-full min-w-full" v-for="(item, index) in data">
                    <router-link :to="item['path']">
                        <button
                                class="mx-auto w-60 text-lg flex flex-col place-items-center  gap-4 inline-block px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
                                type="button_"
                        >
                            <!--                <i :class="item['class']"> </i>-->
                            <span>{{ item["text"] }}</span>
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </modal>
</template>
<script>
    const MODAL_WIDTH = 600;
    export default {
        name: "LoginForms",
        created() {
            this.modalWidth =
                window.innerWidth < MODAL_WIDTH ? MODAL_WIDTH / 2 : MODAL_WIDTH;
        },
        methods:{
            go_to: function (path) {
                // eslint-disable-next-line no-console
                // console.log("push to " + path);
                this.$router.push({path: path});
            }
        },
        data() {
            return {
                modalWidth: 300,
                data: [
                    {path: "/login", text: "User"},
                    {path: "/manager/login", text: "Manager"},
                    {path: "/employee/login", text: "Employee"},
                    {path: "/admin/login", text: "Admin"},
                ],
            };
        },
    };
</script>
<style></style>
