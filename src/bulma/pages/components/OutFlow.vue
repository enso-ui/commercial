<template>
    <div>
       <fulfill :disabled="someRemovedFromStock()"
            :done="allRemovedFromStock()"
            :visible-with="enums.orderStatuses.New"
            v-if="allOrdered()"/>
        <stock-removal/>
        <prepare/>
        <ship :visible-with="enums.orderStatuses.Prepared"/>
        <deliver/>
        <finalize :doable="[enums.orderStatuses.Delivered, enums.orderStatuses.Finalized]
            .includes(status)"/>
        <destroy/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Fulfill from './flow/Fulfill.vue';
import StockRemoval from './flow/StockRemoval.vue';
import Prepare from './flow/Prepare.vue';
import Ship from './flow/Ship.vue';
import Deliver from './flow/Deliver.vue';
import Finalize from './flow/Finalize.vue';
import Destroy from './flow/Destroy.vue';

export default {
    name: 'OutFlow',

    components: { Fulfill, StockRemoval, Prepare, Ship, Deliver, Finalize, Destroy },

    inject: ['allOrdered', 'allRemovedFromStock', 'order', 'someRemovedFromStock'],

    computed: {
        ...mapState(['enums']),
        status() {
            return this.order.form.field('status').value;
        },
    },
};
</script>
