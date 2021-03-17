<template>
    <div class="flow">
        <confirm v-if="allOrdered()"/>
        <ship :visible-with="enums.orderStatuses.Confirmed"/>
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
import Confirm from '../../components/flow/Confirm.vue';
import Ship from '../../components/flow/Ship.vue';
import Receive from '../../components/flow/Receive.vue';
import Fulfill from '../../components/flow/Fulfill.vue';
import StockInsertion from '../../components/flow/StockInsertion.vue';
import Destroy from '../../components/flow/Destroy.vue';
import Finalize from '../../components/flow/Finalize.vue';

export default {
    name: 'InFlow',

    components: { Confirm, Ship, Receive, Fulfill, StockInsertion, Destroy, Finalize },

    inject: ['allInStock', 'allOrdered', 'someInStock'],

    computed: {
        ...mapState(['enums']),
    },
};
</script>
