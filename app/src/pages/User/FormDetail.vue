<template>
    <main class="flex flex-col gap-3 p-10 mx-auto w-5/6 max-h-full">
        <hr class="my-2 border-gray-600"/>
        <h3 class="font-semibold text-2xl mb-5">Maintenance Request</h3>
        <div class="flex flex-col md:flex-row gap-5 justify-center place-items-center w-full">
            <!-- Jumbotron -->
            <div class="w-3/4 p-6 shadow-lg rounded-lg bg-white text-gray-700">
                <h2 class="w-full font-semibold text-3xl mb-5">{{data['item']}}</h2>
                <p>
                    {{data['ServiceType']['name']}}
                </p>
                <hr class="w-full my-6 border-gray-300"/>
                <p style="white-space: pre-wrap">
                    {{data['description']}}
                </p>

                <div class="w-full flex flex-row justify-center place-items-center my-5">Status:
                    <div :class="status"> {{status_val()}}</div>
                </div>
                <div class="w-full py-3 px-6 border-t border-gray-300 text-gray-600">
                    {{parse(data['createdAt'])}}
                </div>

            </div>
            <!-- Jumbotron -->
            <div class="w-3/4 justify-center" v-if="data['ServiceImages'].length > 0">
                <carousel :perPage="1" paginationColor="#6c6c6c">
                    <slide :key="slide.id" class="max-w-full h-auto max-h-96" v-for="slide in data['ServiceImages']">
                        <img v-bind:alt="'Image_' + slide['id']" v-bind:src="api + slide['path']"
                             v-img:name="'form_' + data['id']">
                    </slide>
                </carousel>
            </div>
        </div>
        <div class="flex flex-col justify-center place-items-center gap-2 border-t border-gray-300 text-gray-600 p-2 mt-4"
             v-if="data['Comments'] && data['Comments'].length > 0">
            <h3 class="font-semibold text-2xl mb-5">Comments</h3>
            <carousel :perPage="2" class="w-3/4" paginationColor="#6c6c6c">
                <slide :key="comment.id" class="p-1" v-for="comment in data['Comments']">
                    <div class="rounded-lg shadow-lg bg-white cursor-pointer max-w-sm">
                        <div class="p-5">
                            <p class="text-gray-700 text-base text-justify mb-4">
                                {{comment['content']}}
                            </p>
                            <hr class="my-2 border-gray-300" v-if="comment['ServiceImage']"/>
                            <div class="pt-2 mb-4 w-10 flex flex-row gap-3 " v-if="comment['ServiceImage']">
                                <div>Image</div>
                                <img class="rounded-t-sm" v-bind:alt="'Image_' + comment['ServiceImage']['id']"
                                     v-bind:src="api + comment['ServiceImage']['path']" v-img/>
                            </div>
                            <div class="pt-3 px-6 border-t border-gray-300 text-gray-600">
                                {{comment['owner']}}
                            </div>
                            <div class="pt-3 px-6 ">
                                {{parse(comment['createdAt'])}}
                            </div>

                        </div>
                    </div>
                </slide>
            </carousel>
        </div>
        <div class="flex flex-col justify-center  gap-2 border-t border-gray-600 text-gray-600 p-10 mt-4"
             v-if="data['ServiceResponse']">
            <div class="flex flex-col md:flex-row gap-5 justify-center place-items-center w-full">
                <!-- Jumbotron -->
                <div class="w-3/4 p-6 shadow-lg rounded-lg bg-white text-gray-700">
                    <h3 class="font-semibold text-2xl mb-5">Request Response</h3>
                    <hr class="w-full my-6 border-gray-300"/>
                    <p>
                        {{data['ServiceResponse']['description']}}
                    </p>

                    <div class="flex flex-row gap-3">
                        <div class="w-full flex flex-row justify-center place-items-center my-5">Maintenance:
                            <div :class="data['ServiceResponse']['success'] ? 'bg-green-600 text-white ml-1 p-1 rounded' : 'bg-orange-600 text-white ml-1 p-1 rounded' "> {{data['ServiceResponse']['success'] ? 'Success' : 'Failure'}}</div>
                        </div>

                        <div class="w-full flex flex-row justify-center place-items-center my-5">Status:
                            <div :class="data['ServiceResponse']['approved'] ? 'bg-green-600 text-white ml-1 p-1 rounded' : 'bg-yellow-500 text-white ml-1 p-1 rounded' "> {{data['ServiceResponse']['approved'] ? 'Approved' : 'Pending'}}</div>
                        </div>
                    </div>
                    <div class="w-full py-3 px-6 border-t border-gray-300 text-gray-600">
                        {{parse(data['createdAt'])}}
                    </div>

                </div>
                <!-- Jumbotron -->
                <div class="w-3/4 justify-center" v-if="data['ServiceResponse']['ServiceImages'].length > 0">
                    <carousel :perPage="1" paginationColor="#6c6c6c">
                        <slide :key="slide.id" class="max-w-full h-auto max-h-96" v-for="slide in data['ServiceResponse']['ServiceImages']">
                            <img v-bind:alt="'Image_' + slide['id']" v-bind:src="api + slide['path']"
                                 v-img:name="'form_' + data['id']">
                        </slide>
                    </carousel>
                </div>
            </div>
            <div class="flex flex-col justify-center place-items-center gap-2 border-t border-gray-300 text-gray-600 p-2 mt-4"
                 v-if="data['ServiceResponse']['Comments'] && data['ServiceResponse']['Comments'].length > 0">
                <h3 class="font-semibold text-2xl mb-5">Comments</h3>
                <carousel :perPage="2" class="w-3/4" paginationColor="#6c6c6c">
                    <slide :key="comment.id" class="p-1" v-for="comment in data['ServiceResponse']['Comments']">
                        <div class="rounded-lg shadow-lg bg-white cursor-pointer max-w-sm">
                            <div class="p-5">
                                <p class="text-gray-700 text-base text-justify mb-4">
                                    {{comment['content']}}
                                </p>
                                <hr class="my-2 border-gray-300" v-if="comment['ServiceImage']"/>
                                <div class="pt-2 mb-4 w-10 flex flex-row gap-3 " v-if="comment['ServiceImage']">
                                    <div>Image</div>
                                    <img class="rounded-t-sm" v-bind:alt="'Image_' + comment['ServiceImage']['id']"
                                         v-bind:src="api + comment['ServiceImage']['path']" v-img/>
                                </div>
                                <div class="pt-3 px-6 border-t border-gray-300 text-gray-600">
                                    {{parse(comment['createdAt'])}}
                                </div>

                            </div>
                        </div>
                    </slide>
                </carousel>
            </div>
        </div>
    </main>
</template>

<script>

    import moment from 'moment'
    import {Carousel, Slide} from 'vue-carousel';

    export default {
        name: "FromDetail",
        components: {
            Carousel,
            Slide,
        },
        created: function () {
            let form = this.$store.getters.UDF;
            if (form['active']) {
                this.data = form['data'];
                this.$store.commit('setUserUpdate', {type: 'Form', val: false, data: null});
                this.$store.commit('setNotificationSeen', {type: 'other', id: this.data['id']});
            } else {
                this.$router.push('/user/forms/');
            }
        },
        methods: {
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            status_val() {
                let data = this.data;
                return data['completed'] ? 'Completed' : (data['assigned'] ? 'Assigned' : data['rejected'] ? 'Rejected' : 'Pending')
            },
        },
        data() {
            return {
                data: null,
                agileOptions: {
                    navButtons: true,
                    responsive: [
                        {
                            breakpoint: 600,
                            settings: {
                                dots: false
                            }
                        },

                        {
                            breakpoint: 900,
                            settings: {
                                navButtons: true,
                                dots: true,
                                infinite: false
                            }
                        }
                    ]
                },
                api: this.$store.getters.API,
            };
        },
        computed: {
            status() {
                let data = this.data;
                let val = data['completed'] ? 'bg-green-600 text-white' : (data['assigned'] ? 'bg-yellow-500 text-white' : data['rejected'] ? 'bg-red-600 text-white' : 'bg-orange-600 text-white');
                return val + " ml-1 p-1 rounded"
            }
        },
    };
</script>
