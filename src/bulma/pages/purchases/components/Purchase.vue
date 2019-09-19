<template>
    <order ref="order"/>
</template>

<script>
import Order from '../../components/Order.vue';
import order from '../../components/mixins/order';
import hasIns from '../../components/mixins/hasIns';

export default {
    name: 'Purchase',

    components: { Order },

    mixins: [order, hasIns],

    inject: ['i18n', 'route'],

    methods: {
        downloadGrn() {
            window.open(this.route('commercial.purchases.grn', this.$route.params), '_blank');
        },
        downloadOrder() {
            window.open(this.route('commercial.purchases.order', this.$route.params), '_blank');
        },
    },

    provide() {
        return {
            order: this.order,

            insertInStock: this.insertInStock,
            undoStockInsertion: this.undoStockInsertion,
            noneInStock: this.noneInStock,
            someInStock: this.someInStock,
            allInStock: this.allInStock,
            insertable: this.insertable,

            downloadOrder: this.downloadOrder,
            downloadGrn: this.downloadGrn,
        };
    },
};
</script>
