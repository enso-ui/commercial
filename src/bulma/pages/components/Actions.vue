<template>
    <component :is="order.form.param('type')"
        v-on="$listeners"/>
</template>

<script>
import Purchase from '../purchases/components/Actions.vue';
import Sale from '../sales/components/Actions.vue';
import PurchaseReturn from '../purchaseReturns/components/Actions.vue';
import SaleReturn from '../saleReturns/components/Actions.vue';

export default {
    components: {
        Purchase, Sale, PurchaseReturn, SaleReturn,
    },

    inject: ['order'],
};
</script>

<style lang="scss">
    .actions {
        margin-top: 2em;
    }
</style>
