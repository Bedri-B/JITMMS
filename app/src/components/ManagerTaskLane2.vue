<template>
    <div class="pb-10 ">
        <h3 class="uppercase text-gray-1 text-left">{{ title }} <span
                class="rounded-full px-2 py-1 bg-primary-light text-primary-normal text-xs leading-none">{{itemCount}}</span>
        </h3>
        <div class="mt-3">
            <div class="flex flex-col">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div class="overflow-hidden">
                            <table class="min-w-full">
                                <thead class="bg-white border-b">
                                <tr>
                                    <th class="text-sm font-medium text-gray-900 px-6 py-4 text-left" scope="col">
                                        Requester
                                    </th>
                                    <th class="text-sm font-medium text-gray-900 px-6 py-4 text-left" scope="col">
                                        Issue
                                    </th>
                                    <th class="text-sm font-medium text-gray-900 px-6 py-4 text-left" scope="col">
                                        Date
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr :key="item.id" @click="detail(item.id)"
                                    class="text-justify bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                                    v-for="item in items">
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {{ item['User']['firstName'] }} {{ item['User']['lastName']}}
                                        <small>({{item['User']['UserType']['name']}})</small>
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {{ item['ServiceType']['name']}}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {{parse(item['createdAt'])}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: "ManagerTaskLane",
        props: ['items', 'title', 'id'],
        data() {
            return {
                dragOptions: {
                    animation: 200,
                    group: "description",
                    disabled: true,
                    ghostClass: "ghost"
                },
                drag: false
            }
        },
        methods: {
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            detail: function (id) {
                let items = this.$store.getters.MDFS;
                if (items !== null) {
                    for (let item of items) {
                        if (item['id'] === id) {
                            this.$store.commit('setManagerUpdate', {type: 'Item', val: true, data: item});
                            this.$router.push('/manager/requests/detail');
                            break;
                        }
                    }
                } else {
                    this.$router.push('/user/forms/detail');
                }
            },
        },
        computed: {
            itemCount() {
                if (!this.items) return '';
                return this.items.length;
            },
            draggables: {
                get() {
                    return this.items;
                },
            }
        }
    }
</script>

<style scoped>
    .ghost {
        @apply opacity-50 bg-blue-light;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }
</style>