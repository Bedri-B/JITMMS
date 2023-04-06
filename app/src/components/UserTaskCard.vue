<template>
    <div :class="cardClass" @click="detail(item.id)" class="p-5 flex bg-white shadow-2l cursor-pointer">
        <div class="flex-1">
            <p class="text-left">{{ parseDesc(item['item']) }}</p>
            <p class="text-left text-black-3">{{ item['ServiceType']['name'] }}</p>
            <p class="text-left text-black-3 text-sm" v-if="item['ServiceImages'].length > 0">
                {{item['ServiceImages'].length}} Image(s)</p>
            <div class="flex-1 mt-3">
                <p class="text-right text-black-3">{{parse(item['createdAt'])}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        name: "UserTaskCard",
        props: ['item', 'group'],
        methods: {
            parse(date) {
                return moment(date).format('MMMM Do YYYY');
            },
            parseDesc(string) {
                return string.length < 15 ? string : (string.toString().substring(0, 15) + "...");
            },
            detail: function (id) {
                let items = this.$store.getters.UDFS;
                if (items !== null) {
                    for (let item of items) {
                        if (item['id'] === id) {
                            this.$store.commit('setUserUpdate', {type: 'Item', val: true, data: item});
                            this.$router.push('/user/forms/detail');
                            break;
                        }
                    }
                } else {
                    this.$router.push('/user/forms/detail');
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
                    case "rejected":
                        cardClass += 'border-red-600';
                        break;
                    case "assigned":
                        cardClass += 'border-yellow-400';
                        break;
                    case "completed":
                        cardClass += 'border-green-600';
                        break;
                }
                return cardClass;
            }
        }
    }
</script>

<style scoped>

</style>