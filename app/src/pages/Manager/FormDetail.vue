<template>
    <main class="flex flex-col gap-3 p-10 mx-auto w-5/6 max-h-full">
        <accept-request />
        <reject-request />
        <add-comment />

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

        <!--        Pending  Actions        -->
        <div v-if="!data['assigned'] && !data['rejected']">
            <hr class="my-2 border-gray-300 mt-3"/>
            <h3 class="font-semibold text-2xl mb-5">Actions</h3>
            <div class="flex flex-row p-2 gap-5 justify-center">
                <button class="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 active:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        type="button_"
                        @click="$modal.show('accept-request', data)">
                    Accept
                </button>
                <button class="inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-red-600 hover:shadow-lg focus:bg-red-600 active:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        type="button_"
                        @click="$modal.show('reject-request', data)">
                    Reject
                </button>
            </div>
        </div>
        <!--      End  Pending   Actions       -->

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

        <!--        Assigned but not completed  Actions        -->
        <div v-if="data['assigned'] && !data['completed'] && !data['rejected']">
            <hr class="my-2 border-gray-300 mt-3"/>
            <h3 class="font-semibold text-2xl mb-5">Actions</h3>
            <div class="flex flex-row p-2 gap-5 justify-center">
                <button class="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 active:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                        type="button_"
                        @click="$modal.show('add-comment', {'data': data, 'type': 'Request'})">
                    Add Comment
                </button>
            </div>
        </div>
        <!--      End  Assigned but not completed Actions       -->

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

            <!--        Completed Actions        -->
            <div v-if="data['pending'] && data['completed'] && !data['rejected']">
                <hr class="my-2 border-gray-300 mt-3"/>
                <h3 class="font-semibold text-2xl mb-5">Actions</h3>
                <div class="flex flex-row p-2 gap-5 justify-center">
                    <button class="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 active:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                            type="button_"
                            @click="approveResponse">
                        Approve
                    </button>

                    <button class="inline-block px-6 py-2.5 bg-blue-500 text-white font-medium text-lg leading-tight  rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 active:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
                            type="button_"
                            @click="$modal.show('add-comment', {'data': data, 'type': 'Response'})">
                        Add Comment
                    </button>
                </div>
            </div>
            <!--      End  Completed Actions       -->
        </div>
    </main>
</template>

<script>

    import moment from 'moment';
    import axios from 'axios';
    import {Carousel, Slide} from 'vue-carousel';
    import AcceptRequest from "./Component/AcceptRequest";
    import RejectRequest from "./Component/RejectRequest";
    import AddComment from "./Component/AddComment";

    export default {
        name: "FromDetail",
        components: {
            Carousel,
            Slide,
            AcceptRequest,
            RejectRequest,
            AddComment
        },
        created: function () {
            let form = this.$store.getters.MDF;
            if (form['active']) {
                this.data = form['data'];
                this.$store.commit('setManagerUpdate', {type: 'Form', val: false, data: null});
                this.$store.commit('setNotificationSeen', {type: 'other', id: this.data['id']});
            } else {
                this.$router.push('/manager/requests/new');
            }
        },
        methods: {
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            status_val() {
                let data = this.data;
                return data['completed'] ? 'Completed' : (data['assigned'] ? 'Assigned' : data['rejected'] ? 'Rejected':'Pending')
            },
            approveResponse: async function () {
                this.loading = true;
                let data = {
                    'id': this.data['ServiceResponse']['id'],
                };
                let formData = new FormData();
                for (let key in data) {
                    formData.append(key, data[key]);
                }
                if(!this.$store.getters.AuthStatus) return;
        await axios(this.$store.getters.API + '/api/service_response/approve', {
                    method: "post",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-access-token": this.$store.getters.AuthToken
                    },
                    data: formData
                }).then((response) => {
                    // eslint-disable-next-line no-console
                    // console.log(response);
                    let res = response.data;
                    if (res.status === 200) {
                        this.$toast.success("Response approved successfully!");
                        this.$router.push('/manager/requests/assigned');
                    }
                    else if(res.status === 400) {
                        let errors = res.data;
                        for(let index in errors){
                            this.error[index] = errors[index];
                        }
                    }
                    else{
                        this.$toast.error(res.message);
                    }
                    this.loading = false;
                }).catch((error) => {
                    //console.log(error);
                    if(error.response){
                        this.error_pit = error;
                        this.error_msg = "Internal Server Error! (" + error.response.status + ")";
                        this.$toast.error(this.error_msg);
                    }
                    else{
                        this.error_msg = "Network Error!";
                        this.$toast.error(this.error_msg);
                    }
                    this.loading = false;
                });
            }
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
