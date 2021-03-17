<template>
    <component :is="order.form.param('type')"
        v-on="$listeners"/>
</template>

<script>
import Purchase from '../purchases/components/Controls.vue';
import Sale from '../sales/components/Controls.vue';
import PurchaseReturn from '../purchaseReturns/components/Controls.vue';
import SaleReturn from '../saleReturns/components/Controls.vue';

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
