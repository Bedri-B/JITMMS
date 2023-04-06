<template>
    <main
            :style="{ backgroundImage: 'url(' + require('../assets/img/background.jpg') + ')'}"
            class="bg-black min-h-full max-h-screen cui text-white"
            v-if="visible"
    >
        <login-forms/>
        <div class="border-b-2 border-gray-200">
            <ul class="flex flex-row justify-between p-4">
                <li class="flex flex-row gap-2 place-self-center">
                    <img alt="Logo" class="img_" src="../assets/logo.png"/>
                    <h3>JIT Maintenance Management System</h3>
                </li>
                <li>
                    <div class="flex space-x-2 justify-center">
                        <div
                                @click="login_forms"
                                class="inline-block px-6 py-2.5 bg-yl-normal text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yl-light hover:shadow-lg focus:bg-yl-light focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yl-light active:shadow-lg transition duration-150 ease-in-out"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                type="button_"
                        >
                            Login
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div
                class="mt-10 max-w-screen min-h-full max-h-screen overflow-auto place-items-start p-10"
        >
            <div class="flex flex-col md:flex-row max-h-screen py-12">
                <div class="w-full md:w-1/2 max-h-full flex flex-col mt-10 py-5 gap-4">
                    <div class="text-2xl font-bold">{{ data["title"] }}</div>
                    <p class="text-justify">
                        {{ data["text"] }}
                    </p>
                </div>
                <div
                        class="w-full md:w-1/2 min-h-full max-h-screen flex flex-col items-center p-5 gap-4"
                >
                    <div class="carousel slide relative" id="carouselExampleControls">
                        <div class="carousel-inner relative w-full overflow-hidden">
                            <div
                                    :class="img_visible && images[i] ? 'active' : 'inactive'"
                                    :key="i"
                                    class="slide_item transition-all ease-in-out duration-300 carousel-item relative float-left w-full"
                                    v-for="(n, i) in data['images']"
                            >
                                <img
                                        :src="require(`../assets/img/slide/${n}`)"
                                        class="block w-full rounded object-contain max-w-lg"
                                        v-bind:alt="'Image_' + i"
                                        v-img:name="'main_page_carousel'"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
     import LoginForms from "./LoginForms";

    export default {
        name: "Main-Page",
        components: {LoginForms},
        beforeMount() {
            if (this.$store.getters.AuthStatus) {
                this.$router.push(
                    "/" + this.$store.getters.AuthType.toString().toLowerCase() + "/home"
                );
            } else {
                this.visible = true;
            }
            this.autoplay = true;
        },
        created: function () {
            let json_data = {};
            try {
                json_data = require("../assets/data.json");
            }
            catch (Exception) {
                json_data = {
                    title: "Maintenance Management System",
                    text: "Lorem Ipsum is simply dummy text of the printing and typesetting\n                        industry. Lorem Ipsum has been the industry's standard dummy text\n                        ever since the 1500s, when an unknown printer took a galley of type\n                        and scrambled it to make a type specimen book. It has survived not\n                        only five centuries, but also the leap into electronic typesetting,\n                        remaining essentially unchanged. It was popularised in the 1960s\n                        with the release of Letraset sheets containing Lorem Ipsum passages,\n                        and more recently with desktop publishing software like Aldus\n                        PageMaker including versions of Lorem Ipsum.",
                    images: ["slide_0.jpg", "slide_1.jpg", "slide_2.jpg", "slide_3.jpg"],
                };
            }
            this.image_count = json_data["images"].length;
            this.data = json_data;
            this.animation_interval = json_data['play_speed'];
            this.images = this.getImages();
        },
        methods: {
            login_forms: function () {
                this.$modal.show("login-forms");
            },
            getImages: function () {
                let ll = [];
                for (let index = 0; index < this.image_count; index++) {
                    ll.push(false);
                }
                ll[0] = true;
                this.animate();
                return ll;
            },
            animate: function () {
                this.img_visible = false;
                if (this.i_index === this.image_count - 1) {
                    this.i_index = 0;
                } else {
                    this.i_index = this.i_index + 1;
                }
                for (let i = 0; i < this.image_count; i++) {
                    this.images[i] = this.i_index === i;
                }
                let obj = this;
                setTimeout(() => {
                    if (this.autoplay) obj.animate();
                }, obj.animation_interval);
                this.img_visible = true;
            },
            _Slide: function (fwd) {
                this.img_visible = false;
                if (fwd) {
                    if (this.i_index === this.image_count - 1) {
                        this.i_index = 0;
                    } else {
                        this.i_index = this.i_index + 1;
                    }
                } else {
                    if (this.i_index === 0) {
                        this.i_index = this.image_count - 1;
                    } else {
                        this.i_index = this.i_index - 1;
                    }
                }
                for (let i = 0; i < this.image_count; i++) {
                    this.images[i] = this.i_index === i;
                }
                this.img_visible = true;
            },
        },
        data() {
            return {
                autoplay: false,
                data: {},
                animation_interval: 5000,
                image_count: 0,
                visible: false,
                i_index: -1,
                img_visible: false,
                images: [],
            };
        },
    };
</script>

<style scoped>
    .cui {
        width: 100%;
        margin: 0;
        padding: 0;
        font-family: "Montserrat", sans-serif;
        background-size: cover;
        background-repeat: no-repeat;
        overflow: hidden;
    }

    .img_ {
        width: 22px !important;
        height: 24px !important;
    }

    .slide_item {
        transition: opacity 1s;
    }

    .slide_item.inactive {
        opacity: 50%;
    }
</style>
