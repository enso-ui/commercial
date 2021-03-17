<template>
    <div>
        <ship :visible-with="enums.orderStatuses.New"
            v-if="allOrdered()"/>
        <receive/>
        <fulfill :disabled="someInStock()"
            :done="allInStock()"
            :visible-with="enums.orderStatuses.Received"/>
        <stock-insertion/>
        <finalize :doable="allInStock()"/>
        <destroy/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Ship from '../../components/flow/Ship.vue';
import Receive from '../../components/flow/Receive.vue';
import Fulfill from '../../components/flow/Fulfill.vue';
import StockInsertion from '../../components/flow/StockInsertion.vue';
import Destroy from '../../components/flow/Destroy.vue';
import Finalize from '../../components/flow/Finalize.vue';

export default {
    name: 'Flow',

    components: { Ship, Receive, Fulfill, StockInsertion, Destroy, Finalize },

    inject: ['allOrdered', 'allInStock', 'someInStock'],

    computed: {
        ...mapState(['enums']),
    },
};
</script>
