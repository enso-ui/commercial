<template>
    <div>
        <confirm/>
        <ship/>
        <receive/>
        <fulfill/>
        <stock-insertion/>
        <finalize/>
        <destroy/>
    </div>
</template>

<script>
import Confirm from './flow/Confirm.vue';
import Ship from './flow/Ship.vue';
import Receive from './flow/Receive.vue';
import Fulfill from './flow/Fulfill.vue';
import StockInsertion from './flow/StockInsertion.vue';
import Destroy from './flow/Destroy.vue';
import Finalize from './flow/Finalize.vue';

export default {
    name: 'InFlow',

    components: { Confirm, Ship, Receive, Fulfill, StockInsertion, Destroy, Finalize },
};
</script>
