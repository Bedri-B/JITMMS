<template>
    <div :class="cardClass" @click="detail(item.id)" class="p-5 flex bg-white shadow-2l cursor-pointer">
        <div class="flex-1">
            <div class="flex flex-row gap-2 place-items-center">
                <p class="text-lg font-semibold">{{ item['User']['firstName'] }} {{ item['User']['lastName'] }}</p>
                <p class="text-left text-black-4 text-base">{{item['User']['UserType']['name']}}</p>
            </div>
            <p class="text-left text-black-4 text-base">Building: {{item['User']['building_no']}}</p>
            <p class="text-left text-black-4 text-base">Room: {{item['User']['room_no']}}</p>

            <div class="flex flex-col border-t border-gray-300 pt-7 pb-2">
                <p class="text-base font-semibold text-left">{{ item['item'] }}</p>
                <p class="text-left text-black-4">{{ item['ServiceType']['name'] }}</p>
            </div>

            <div class="flex flex-col gap-2 border-t border-gray-300 pt-5">
                <p class="text-base text-left">{{ parseDesc(item['description']) }}</p>
                <p class="text-left text-black-3 text-base" v-if="item['ServiceImages'].length > 0">Attached Images: {{item['ServiceImages'].length}}</p>
                <p class="text-left text-black-4" v-if="item['assigned']">Assigned to: {{ item['Employee']['firstName'] }} {{ item['Employee']['lastName'] }}</p>
            </div>


            <div class="flex-1 mt-3">
                <p class="text-right text-black-4">{{parse(item['createdAt'])}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        name: "ManagerTaskCard",
        props: ['item', 'group'],
        methods: {
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            parseDesc(string) {
                return string.length < 50 ? string : (string.toString().substring(0, 50) + "...");
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
                    this.$router.push('/manager/requests/new');
                }
            },
        },
        computed: {
            cardClass() {
                let cardClass = 'border-l-3 border-solid ';
                switch (this.group) {
                    case "pending":
                        cardClass += 'border-orange-600';
                        break;
                    case "assigned":
                        cardClass += 'border-yellow-400';
                        break;
                    case "archived":
                        cardClass += 'border-slate-900';
                        break;
                    case "rejected":
                        cardClass += 'border-red-500';
                        break;
                }
                return cardClass;
            }
        }
    }
</script>

<style scoped>

</style>